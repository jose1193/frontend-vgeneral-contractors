// scripts/generators/index.ts
import { generateInterface } from "./generators/interface";
import { generateStore } from "./generators/store";
import { generateActions } from "./generators/actions";
import { generateHooks } from "./generators/hooks";
import { generateComponents } from "./generators/components";
import { generateValidation } from "./generators/validation";
import { generateAppRouter } from "./generators/app-router";
import type { Field, GeneratorConfig } from "./types";

export const generateCrudFiles = async (name: string, fields: Field[]) => {
  try {
    const baseDir = process.cwd();
    const pluralName = `${name}s`; // Pluralización simple

    const config: GeneratorConfig = {
      name,
      pluralName,
      baseDir,
      fields,
    };

    console.log("\n🚀 Starting CRUD generation...");
    console.log(`📦 Model: ${name}`);
    console.log(`🔧 Fields: ${fields.length}`);

    // Generar todos los archivos necesarios
    await generateInterface(config);
    console.log("✅ Generated types/interfaces");

    await generateStore(config);
    console.log("✅ Generated Zustand store");

    await generateActions(config);
    console.log("✅ Generated API actions");

    await generateHooks(config);
    console.log("✅ Generated custom hooks");

    await generateValidation(config);
    console.log("✅ Generated validation schema");

    await generateComponents(config);
    console.log("✅ Generated React components");

    await generateAppRouter(config);
    console.log("✅ Generated Next.js pages");

    // Resumen final
    console.log("\n✨ CRUD generation completed successfully!");
    console.log("\nCreated files:");
    console.log(`📁 types/${name.toLowerCase()}.ts`);
    console.log(`📁 stores/${name.toLowerCase()}Store.ts`);
    console.log(`📁 lib/actions/${name.toLowerCase()}Actions.ts`);
    console.log(`📁 lib/validations/${name.toLowerCase()}Validation.ts`);
    console.log(`📁 hooks/use${name}.ts`);
    console.log(`📁 hooks/use${name}Sync.ts`);
    console.log(`📁 components/${name}/${name}Form.tsx`);
    console.log(`📁 components/${name}/${name}List.tsx`);
    console.log(`📁 app/dashboard/${name.toLowerCase()}s/page.tsx`);
    console.log(`📁 app/dashboard/${name.toLowerCase()}s/[uuid]/page.tsx`);
    console.log(`📁 app/dashboard/${name.toLowerCase()}s/[uuid]/edit/page.tsx`);
    console.log(`📁 app/dashboard/${name.toLowerCase()}s/create/page.tsx`);

    console.log("\n📘 Next steps:");
    console.log("1. Review the generated files and adjust as needed");
    console.log("2. Add the new route to your navigation menu");
    console.log(`3. Access your new CRUD at /dashboard/${name.toLowerCase()}s`);
  } catch (error) {
    console.error("\n❌ Error generating CRUD:", error);
    throw error;
  }
};
