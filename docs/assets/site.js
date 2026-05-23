const products = [
  {
    name: "SBInjector",
    manifestUrl: "./files/SBInjector/latest.json",
  },
  {
    name: "OsuPatch",
    manifestUrl: "./files/OsuPatch/latest.json",
  }
];

async function hydrateProductCard(product) {
  const card = document.querySelector(`[data-product-card="${product.name}"]`);
  if (!card) {
    return;
  }

  try {
    const response = await fetch(product.manifestUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Fetch version manifest error: ${response.status}`);
    }

    const manifest = await response.json();
    const version = card.querySelector('[data-field="version"]');
    const releaseNote = card.querySelector('[data-field="releaseNote"]');
    const downloadLink = card.querySelector('[data-field="downloadUrl"]');

    if (version) {
      version.textContent = manifest.version || "N/A";
    }

    if (releaseNote) {
      releaseNote.textContent = manifest.releaseNote || "N/A";
    }

    if (downloadLink && manifest.downloadUrl) {
      downloadLink.href = manifest.downloadUrl;
      downloadLink.textContent = 'Download';
    }
  } catch (error) {
    const version = card.querySelector('[data-field="version"]');
    const releaseNote = card.querySelector('[data-field="releaseNote"]');

    if (version) {
      version.textContent = "Failed to load version info";
    }

    if (releaseNote) {
      releaseNote.textContent = "Failed to load Release Note";
    }

    console.error(`Failed to load manifest for ${product.name}:`, error);
  }
}

Promise.all(products.map(hydrateProductCard));
