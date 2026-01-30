/**
 * ANALISADOR DE CÓDIGO - ThriveOS Game
 * 
 * Este script analisa o repositório e identifica:
 * - Funções chamadas mas não definidas
 * - Importações não utilizadas
 * - Variáveis não definidas
 * - Exports sem uso
 * 
 * COMO USAR:
 * 1. Salve este arquivo como 'analyze-repo.js' na raiz do projeto
 * 2. Execute: node analyze-repo.js
 */

const fs = require('fs');
const path = require('path');

// Configurações
const SRC_DIR = './src';
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build'];
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Armazenamento de análise
const analysis = {
  imports: new Map(),      // arquivo -> [imports]
  exports: new Map(),      // arquivo -> [exports]
  functions: new Map(),    // arquivo -> [funções definidas]
  calls: new Map(),        // arquivo -> [funções chamadas]
  variables: new Map(),    // arquivo -> [variáveis definidas]
  issues: []               // problemas encontrados
};

/**
 * Lê todos os arquivos JS/JSX/TS/TSX do diretório
 */
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (FILE_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

/**
 * Extrai imports de um arquivo
 */
function extractImports(content, filePath) {
  const imports = [];
  
  // import { something } from 'somewhere'
  const namedImportsRegex = /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = namedImportsRegex.exec(content)) !== null) {
    const importedItems = match[1].split(',').map(item => {
      const parts = item.trim().split(/\s+as\s+/);
      return {
        original: parts[0].trim(),
        alias: parts[1] ? parts[1].trim() : parts[0].trim(),
        from: match[2]
      };
    });
    imports.push(...importedItems);
  }
  
  // import Something from 'somewhere'
  const defaultImportRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
  while ((match = defaultImportRegex.exec(content)) !== null) {
    imports.push({
      original: 'default',
      alias: match[1],
      from: match[2]
    });
  }
  
  return imports;
}

/**
 * Extrai exports de um arquivo
 */
function extractExports(content) {
  const exports = [];
  
  // export const something
  const namedExportsRegex = /export\s+(?:const|let|var|function|class)\s+(\w+)/g;
  let match;
  
  while ((match = namedExportsRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }
  
  // export { something }
  const exportListRegex = /export\s+{([^}]+)}/g;
  while ((match = exportListRegex.exec(content)) !== null) {
    const items = match[1].split(',').map(item => item.trim().split(/\s+as\s+/)[0]);
    exports.push(...items);
  }
  
  // export default
  if (content.includes('export default')) {
    exports.push('default');
  }
  
  return exports;
}

/**
 * Extrai definições de funções
 */
function extractFunctions(content) {
  const functions = [];
  
  // function name()
  const functionRegex = /function\s+(\w+)\s*\(/g;
  let match;
  
  while ((match = functionRegex.exec(content)) !== null) {
    functions.push(match[1]);
  }
  
  // const name = () => ou const name = function()
  const arrowFunctionRegex = /(?:const|let|var)\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>|function)/g;
  while ((match = arrowFunctionRegex.exec(content)) !== null) {
    functions.push(match[1]);
  }
  
  return functions;
}

/**
 * Extrai chamadas de função
 */
function extractFunctionCalls(content) {
  const calls = new Set();
  
  // Remove strings e comentários para evitar falsos positivos
  const cleanContent = content
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/['"`][\s\S]*?['"`]/g, '');
  
  // functionName(
  const callRegex = /(\w+)\s*\(/g;
  let match;
  
  while ((match = callRegex.exec(cleanContent)) !== null) {
    calls.add(match[1]);
  }
  
  return Array.from(calls);
}

/**
 * Extrai variáveis definidas
 */
function extractVariables(content) {
  const variables = [];
  
  const varRegex = /(?:const|let|var)\s+(\w+)/g;
  let match;
  
  while ((match = varRegex.exec(content)) !== null) {
    variables.push(match[1]);
  }
  
  return variables;
}

/**
 * Analisa um arquivo
 */
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  analysis.imports.set(relativePath, extractImports(content, filePath));
  analysis.exports.set(relativePath, extractExports(content));
  analysis.functions.set(relativePath, extractFunctions(content));
  analysis.calls.set(relativePath, extractFunctionCalls(content));
  analysis.variables.set(relativePath, extractVariables(content));
}

/**
 * Encontra problemas
 */
function findIssues() {
  const allExports = new Map();
  const allImports = new Map();
  
  // Mapeia todos os exports
  analysis.exports.forEach((exports, file) => {
    exports.forEach(exp => {
      if (!allExports.has(exp)) {
        allExports.set(exp, []);
      }
      allExports.get(exp).push(file);
    });
  });
  
  // Verifica cada arquivo
  analysis.imports.forEach((imports, file) => {
    imports.forEach(imp => {
      const usedName = imp.alias;
      const calls = analysis.calls.get(file) || [];
      const variables = analysis.variables.get(file) || [];
      
      // Verifica se o import é usado
      const isUsed = calls.includes(usedName) || 
                     variables.includes(usedName) ||
                     content => content.includes(usedName);
      
      if (!isUsed && imp.from.startsWith('.')) {
        analysis.issues.push({
          type: 'UNUSED_IMPORT',
          file,
          name: usedName,
          from: imp.from,
          severity: 'warning'
        });
      }
      
      // Verifica se o import existe
      if (imp.from.startsWith('.')) {
        const sourcePath = path.resolve(path.dirname(file), imp.from);
        const possibleFiles = [
          sourcePath + '.js',
          sourcePath + '.jsx',
          sourcePath + '/index.js',
          sourcePath + '/index.jsx'
        ];
        
        const sourceExists = possibleFiles.some(f => fs.existsSync(f));
        
        if (!sourceExists) {
          analysis.issues.push({
            type: 'MISSING_MODULE',
            file,
            name: usedName,
            from: imp.from,
            severity: 'error',
            suggestion: `Criar arquivo ${imp.from} ou corrigir o caminho do import`
          });
        }
      }
    });
    
    // Verifica funções chamadas mas não definidas
    const calls = analysis.calls.get(file) || [];
    const functions = analysis.functions.get(file) || [];
    const importedNames = (analysis.imports.get(file) || []).map(i => i.alias);
    const variables = analysis.variables.get(file) || [];
    
    calls.forEach(call => {
      // Ignora funções built-in, do React, etc
      const builtIn = ['console', 'setTimeout', 'setInterval', 'fetch', 'Promise', 
                       'Array', 'Object', 'String', 'Number', 'Boolean', 'Math',
                       'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef',
                       'useContext', 'useReducer', 'map', 'filter', 'forEach', 'reduce'];
      
      if (builtIn.includes(call)) return;
      
      const isDefined = functions.includes(call) || 
                       importedNames.includes(call) ||
                       variables.includes(call);
      
      if (!isDefined) {
        analysis.issues.push({
          type: 'UNDEFINED_FUNCTION',
          file,
          name: call,
          severity: 'error',
          suggestion: `Importar '${call}' ou definir a função`
        });
      }
    });
  });
  
  // Verifica imports duplicados
  analysis.imports.forEach((imports, file) => {
    const seen = new Set();
    imports.forEach(imp => {
      if (seen.has(imp.alias)) {
        analysis.issues.push({
          type: 'DUPLICATE_IMPORT',
          file,
          name: imp.alias,
          severity: 'error',
          suggestion: `Remover import duplicado de '${imp.alias}'`
        });
      }
      seen.add(imp.alias);
    });
  });
}

/**
 * Gera relatório
 */
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('ANÁLISE DE CÓDIGO - ThriveOS Game');
  console.log('='.repeat(80) + '\n');
  
  // Agrupa por tipo e severidade
  const errors = analysis.issues.filter(i => i.severity === 'error');
  const warnings = analysis.issues.filter(i => i.severity === 'warning');
  
  console.log(`📊 RESUMO:`);
  console.log(`   Total de arquivos analisados: ${analysis.imports.size}`);
  console.log(`   ❌ Erros encontrados: ${errors.length}`);
  console.log(`   ⚠️  Avisos: ${warnings.length}\n`);
  
  if (errors.length > 0) {
    console.log('❌ ERROS CRÍTICOS:\n');
    errors.forEach((issue, idx) => {
      console.log(`${idx + 1}. [${issue.type}] em ${issue.file}`);
      console.log(`   Nome: ${issue.name}`);
      if (issue.from) console.log(`   De: ${issue.from}`);
      if (issue.suggestion) console.log(`   💡 Solução: ${issue.suggestion}`);
      console.log('');
    });
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  AVISOS:\n');
    warnings.forEach((issue, idx) => {
      console.log(`${idx + 1}. [${issue.type}] em ${issue.file}`);
      console.log(`   Nome: ${issue.name}`);
      if (issue.from) console.log(`   De: ${issue.from}`);
      console.log('');
    });
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Nenhum problema encontrado!\n');
  }
  
  // Salva relatório em arquivo
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: analysis.imports.size,
      errors: errors.length,
      warnings: warnings.length
    },
    issues: analysis.issues
  };
  
  fs.writeFileSync('analysis-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Relatório detalhado salvo em: analysis-report.json\n');
}

/**
 * Execução principal
 */
function main() {
  console.log('🔍 Iniciando análise do repositório...\n');
  
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`❌ Diretório ${SRC_DIR} não encontrado!`);
    process.exit(1);
  }
  
  const files = getAllFiles(SRC_DIR);
  console.log(`📂 Encontrados ${files.length} arquivos para análise\n`);
  
  files.forEach(file => {
    try {
      analyzeFile(file);
    } catch (error) {
      console.error(`Erro ao analisar ${file}:`, error.message);
    }
  });
  
  findIssues();
  generateReport();
}

// Executa
main();
