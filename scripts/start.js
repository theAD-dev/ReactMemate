const { execSync } = require("child_process");
const prompts = require("prompts");

(async () => {
  const { env } = await prompts({
    type: "select",
    name: "env",
    message: "Select environment",
    choices: [
      { title: "memate dev", value: "dev" },
      { title: "memate prod", value: "prod" }
    ]
  });

  if (!env) {
    console.log("❌ No environment selected");
    process.exit(1);
  }

  console.log(`🚀 Starting Memate (${env})...`);

  execSync(
    `npx env-cmd -f .env.memate.${env} react-scripts start`,
    { stdio: "inherit" }
  );
})();
