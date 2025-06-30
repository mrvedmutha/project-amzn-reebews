const fs = require("fs");
const path = require("path");

/**
 * Create Plans Script
 * This script reads the plans data from JSON and creates plans via API calls
 */

// Configuration
const API_BASE_URL = "http://localhost:3000"; // Change this to your actual API URL
const PLANS_ENDPOINT = "/api/plans";

/**
 * Read plans data from JSON file
 */
function readPlansData() {
  try {
    const filePath = path.join(__dirname, "plans-data.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading plans data:", error.message);
    process.exit(1);
  }
}

/**
 * Create a single plan via API
 */
async function createPlan(planData) {
  try {
    const response = await fetch(`${API_BASE_URL}${PLANS_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✅ Successfully created plan: ${planData.displayName}`);
      return { success: true, data: result.data };
    } else {
      console.error(
        `❌ Failed to create plan ${planData.displayName}:`,
        result.message
      );
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.error(
      `❌ Error creating plan ${planData.displayName}:`,
      error.message
    );
    return { success: false, error: error.message };
  }
}

/**
 * Create all plans from the JSON data
 */
async function createAllPlans() {
  console.log("🚀 Starting plan creation process...\n");

  const plansData = readPlansData();
  const results = [];

  for (const planData of plansData) {
    console.log(`Creating plan: ${planData.displayName} (${planData.name})`);
    const result = await createPlan(planData);
    results.push({ plan: planData.displayName, ...result });

    // Add a small delay between requests to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Summary
  console.log("\n📊 Plan Creation Summary:");
  console.log("========================");

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✅ Successfully created: ${successful.length} plans`);
  successful.forEach((r) => console.log(`   - ${r.plan}`));

  if (failed.length > 0) {
    console.log(`❌ Failed to create: ${failed.length} plans`);
    failed.forEach((r) => console.log(`   - ${r.plan}: ${r.error}`));
  }

  console.log("\n🎉 Plan creation process completed!");
}

/**
 * Check if API is available
 */
async function checkApiAvailability() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/plans?limit=1`);
    return response.status !== 404;
  } catch (error) {
    return false;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log("🔍 Checking API availability...");

  const apiAvailable = await checkApiAvailability();
  if (!apiAvailable) {
    console.error(
      "❌ API is not available. Please ensure your server is running and the API endpoints are accessible."
    );
    console.error(`   Expected API URL: ${API_BASE_URL}${PLANS_ENDPOINT}`);
    process.exit(1);
  }

  console.log("✅ API is available. Proceeding with plan creation...\n");
  await createAllPlans();
}

// Helper function to update API URL
function setApiUrl(url) {
  API_BASE_URL = url;
  console.log(`🔧 API URL updated to: ${API_BASE_URL}`);
}

// Run the script if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("💥 Unexpected error:", error);
    process.exit(1);
  });
}

// Export functions for potential use as a module
module.exports = {
  createAllPlans,
  createPlan,
  readPlansData,
  setApiUrl,
  checkApiAvailability,
};
