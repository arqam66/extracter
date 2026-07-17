import { test, expect } from "@playwright/test";

test.describe("Pakistan BizIntel", () => {
  test("homepage loads with hero, selectors, dashboard, and footer", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Pakistan BizIntel", { exact: true }).first()).toBeVisible();

    await expect(page.locator("select").nth(0)).toBeVisible();
    await expect(page.locator("select").nth(1)).toBeVisible();

    const extractBtn = page.locator("button[type=submit]");
    await expect(extractBtn).toBeVisible();
    await expect(extractBtn).toBeDisabled();

    await expect(page.locator("text=Dashboard")).toBeVisible();
    await expect(page.locator("text=Businesses")).toBeVisible();
    await expect(page.locator("text=Emails Found")).toBeVisible();
    await expect(page.locator("text=Phones Found")).toBeVisible();
    await expect(page.locator("text=Social Accounts")).toBeVisible();

    await expect(page.locator("text=github.com/arqam66/extracter")).toBeVisible();
  });

  test("city dropdown has all 53 Pakistani cities", async ({ page }) => {
    await page.goto("/");

    const citySelect = page.locator("select").nth(0);
    const options = citySelect.locator("option");
    const count = await options.count();
    expect(count).toBe(54);

    const cities = [
      "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
      "Multan", "Peshawar", "Quetta", "Sialkot", "Abbottabad",
      "Gujranwala", "Bahawalpur", "Sargodha", "Sukkur", "Larkana",
      "Mardan", "Mingora", "Nawabshah", "Bannu", "Dera Ghazi Khan",
      "Dera Ismail Khan", "Gwadar", "Jacobabad", "Jhang", "Jhelum",
      "Kohat", "Kotri", "Mianwali", "Mirpur", "Nowshera", "Okara",
      "Rahim Yar Khan", "Shikarpur", "Swat", "Taxila", "Toba Tek Singh",
      "Turbat", "Charsadda", "Chitral", "Daska", "Hafizabad",
      "Haripur", "Kamoke", "Karak", "Khuzdar", "Lasbela",
      "Mansehra", "Matiari", "Naushahro Feroze", "Qambar Shahdadkot",
      "Sanghar", "Thatta", "Ziarat",
    ];
    for (const city of cities) {
      await expect(citySelect.locator(`option[value="${city}"]`)).toBeAttached();
    }
  });

  test("industry dropdown has all 13 industries", async ({ page }) => {
    await page.goto("/");

    const industrySelect = page.locator("select").nth(1);
    const options = industrySelect.locator("option");
    const count = await options.count();
    expect(count).toBe(14);

    const industries = [
      "Security Barriers & Bollards", "Food Venues & Restaurants",
      "Construction", "Textiles", "IT & Software", "Real Estate",
      "Healthcare & Hospitals", "Education", "Automotive",
      "Retail & Shopping", "Manufacturing", "Legal & Law Firms",
      "Hotels & Hospitality",
    ];
    for (const ind of industries) {
      await expect(industrySelect.locator(`option[value="${ind}"]`)).toBeAttached();
    }
  });

  test("extract button enables only when both city and industry selected", async ({ page }) => {
    await page.goto("/");

    const extractBtn = page.locator("button[type=submit]");

    await page.locator("select").nth(0).selectOption("Karachi");
    await expect(extractBtn).toBeDisabled();

    await page.locator("select").nth(1).selectOption("IT & Software");
    await expect(extractBtn).toBeEnabled();
  });

  test("API stats endpoint returns valid structure", async ({ page }) => {
    const res = await page.request.get("/api/stats");
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(data).toHaveProperty("totalBusinesses");
    expect(data).toHaveProperty("verifiedBusinesses");
    expect(data).toHaveProperty("totalSearches");
    expect(data).toHaveProperty("emailsFound");
    expect(data).toHaveProperty("phonesFound");
    expect(data).toHaveProperty("websitesFound");
    expect(data).toHaveProperty("socialsFound");
    expect(data).toHaveProperty("averageConfidence");
    expect(Array.isArray(data.cityBreakdown)).toBeTruthy();
    expect(Array.isArray(data.industryBreakdown)).toBeTruthy();
  });

  test("API search GET returns history when no params", async ({ page }) => {
    const res = await page.request.get("/api/search");
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(data).toHaveProperty("searches");
    expect(Array.isArray(data.searches)).toBeTruthy();
  });

  test("API search POST accepts city + industry", async ({ page }) => {
    const res = await page.request.post("/api/search", {
      data: { city: "Karachi", industry: "IT & Software" },
    });
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(data).toHaveProperty("profiles");
    expect(data).toHaveProperty("city", "Karachi");
    expect(data).toHaveProperty("industry", "IT & Software");
    expect(data).toHaveProperty("cached");
    expect(Array.isArray(data.profiles)).toBeTruthy();
  });

  test("full extraction flow completes and shows results or no-results message", async ({ page }) => {
    await page.goto("/");

    await page.locator("select").nth(0).selectOption("Karachi");
    await page.locator("select").nth(1).selectOption("IT & Software");

    const extractBtn = page.locator("button[type=submit]");
    await extractBtn.click();

    await expect(page.locator("text=Extracting")).toBeVisible({ timeout: 5000 });

    const resultsHeader = page.locator("text=IT & Software in Karachi").first();
    const noResults = page.locator("text=No businesses found");

    await expect(resultsHeader.or(noResults)).toBeVisible({ timeout: 45_000 });

    const hasResults = await resultsHeader.isVisible().catch(() => false);
    const hasNoResults = await noResults.isVisible().catch(() => false);
    expect(hasResults || hasNoResults).toBeTruthy();
  }, 60_000);

  test("search history appears after extraction", async ({ page }) => {
    await page.goto("/");

    await page.locator("select").nth(0).selectOption("Lahore");
    await page.locator("select").nth(1).selectOption("Construction");

    await page.locator("button[type=submit]").click();

    await expect(
      page.locator("text=Construction in Lahore").first()
    ).toBeVisible({ timeout: 45_000 });

    await expect(page.locator("text=Recent Extractions")).toBeVisible();
  }, 60_000);

  test("result card shows PDF download button when results exist", async ({ page }) => {
    await page.goto("/");

    await page.locator("select").nth(0).selectOption("Islamabad");
    await page.locator("select").nth(1).selectOption("Real Estate");

    await page.locator("button[type=submit]").click();

    const noResults = page.locator("text=No businesses found");
    await expect(
      page.getByRole("heading", { name: "Real Estate in Islamabad" }).or(noResults)
    ).toBeVisible({ timeout: 45_000 });

    const hasResults = await page.getByRole("heading", { name: "Real Estate in Islamabad" }).isVisible().catch(() => false);
    if (hasResults) {
      const pdfBtn = page.getByTestId("download-pdf").first();
      await expect(pdfBtn).toBeVisible();
    }
  }, 60_000);
});
