import fs from 'fs/promises';
import path from 'path';
import { transform } from '@svgr/core';
import { countryCodeToName } from './country-map'

const ICONS_DIR = path.join(process.cwd(), 'src/icons');
const OUT_DIR = path.join(process.cwd(), 'dist/icons');
const OUT_DIR_INDEX = path.join(process.cwd(), 'dist');

type IIconExport = {
  componentName: string;
  importPath: string;
}

async function processDirectory(dir: string, relativePath = ''): Promise<IIconExport[]> {
  const files = await fs.readdir(dir);
  let allExports: IIconExport[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relativeFilePath = path.join(relativePath, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      const subDirExports = await processDirectory(fullPath, relativeFilePath);
      allExports = [...allExports, ...subDirExports];
    } else if (file.endsWith('.svg')) {
      const svgCode = await fs.readFile(fullPath, 'utf8');
      const componentName = path.basename(file, '.svg');
      const pascalCaseName = componentName.replace(/(^|-)(\w)/g, (_, __, char) => char.toUpperCase());

      const jsCode = await transform(
        svgCode,
        {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
          typescript: false,
          jsxRuntime: 'classic',
          svgProps: {
            width: '{width}',
            height: '{height}',
            viewBox: '{viewBox}'
          },
          expandProps: 'end',
          template: ({ componentName, jsx }, { tpl }) => {
            const widthMatch = svgCode.match(/width="([^"]+)"/);
            const heightMatch = svgCode.match(/height="([^"]+)"/);
            const viewBoxMatch = svgCode.match(/viewBox="([^"]+)"/);
            
            let defaultViewBox = '"0 0 40 30"'; // Fallback
            if (viewBoxMatch) {
              defaultViewBox = `"${viewBoxMatch[1]}"`;
            } else if (widthMatch && heightMatch) {
              defaultViewBox = `"0 0 ${widthMatch[1]} ${heightMatch[1]}"`;
            }
      
            return tpl`
              import * as React from 'react';
      
              const ${componentName} = ({ 
                width = 40, 
                height = 30, 
                viewBox = ${defaultViewBox},
                ...props 
              }) => (
                ${jsx}
              );
      
              export default ${componentName};
            `;
          }
        },
        { componentName: pascalCaseName }
      );
      

      const outSubDir = path.join(OUT_DIR, relativePath);
      await fs.mkdir(outSubDir, { recursive: true });

      await fs.writeFile(
        path.join(outSubDir, `${pascalCaseName}.jsx`),
        jsCode
      );

      const dtsContent = `
        import * as React from 'react';
        import type { SVGProps } from 'react';

        declare const ${pascalCaseName}: React.FC<SVGProps<SVGSVGElement>>;
        export default ${pascalCaseName};
      `;
      await fs.writeFile(path.join(outSubDir, `${pascalCaseName}.d.ts`), dtsContent.trim());

      const exportPath = path.join('icons', relativePath, pascalCaseName);
      allExports.push({
        componentName: pascalCaseName,
        importPath: exportPath.replace(/\\/g, '/'),
      });
    }
  }

  return allExports;
}


async function buildIcons() {
  try {
    await fs.mkdir(OUT_DIR, { recursive: true });

    const allExports = await processDirectory(ICONS_DIR);
    const indexLines: string[] = [];
    const dtsLines: string[] = [];

    for (const { componentName, importPath } of allExports) {
      indexLines.push(`export { default as ${componentName} } from './${importPath}.jsx';`);
      dtsLines.push(`export { default as ${componentName} } from './${importPath}.js';`);

      const iso = componentName.toLowerCase();
      const countryName = countryCodeToName[iso];

      if (countryName) {
        const safeName = countryName.replace(/[^a-zA-Z0-9]/g, ''); // Remove spaces and special chars
        indexLines.push(`export { default as ${safeName} } from './${importPath}.jsx';`);
        dtsLines.push(`export { default as ${safeName} } from './${importPath}.js';`);
      }
    }

    await fs.writeFile(path.join(OUT_DIR_INDEX, 'index.js'), indexLines.join('\n'));
    await fs.writeFile(path.join(OUT_DIR_INDEX, 'index.d.ts'), dtsLines.join('\n'));

    console.log(`Generated ${allExports.length} icon components with aliases`);
  } catch (error) {
    console.error('Error building icons:', error);
    process.exit(1);
  }
}

buildIcons();
