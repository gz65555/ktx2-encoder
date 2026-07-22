// Phase 4 + 5: independent-consumer transcode + quality (SSIM) validation.
//
// Loads the shipped KTX2 goldens through @galacean/engine — an INDEPENDENT KTX2
// transcoder, not our encoder — renders them, reads back the decoded pixels,
// and compares to the reference PNG with SSIM (ssim.js). This validates both
// that the output actually decodes to correct pixels (Phase 4) and that the
// v2.5 encoder's quality has not regressed (Phase 5).
//
// Approach mirrors https://github.com/gz65555/ktx2-ssim.
import { test, expect } from "vitest";
import { decodeToImageData, mssim } from "./browser-quality";

test("v2.5 goldens transcode + SSIM vs reference", { timeout: 120000 }, async () => {
  const ref = await decodeToImageData("/tests/DuckCM.png");
  const etc1s = await decodeToImageData("/tests/DuckCM-etc1s.ktx2");
  const uastc = await decodeToImageData("/tests/DuckCM-uastc.ktx2");

  const sEtc1s = mssim(ref, etc1s);
  const sUastc = mssim(ref, uastc);
  console.log(`[quality] SSIM etc1s=${(sEtc1s * 100).toFixed(3)}%  uastc=${(sUastc * 100).toFixed(3)}%`);

  // Measured on v2.5: etc1s ~0.9966, uastc ~0.9981. Thresholds sit below that
  // with margin for GPU/driver variance, but still catch a real quality drop.
  expect(sEtc1s, `ETC1S SSIM ${sEtc1s} regressed`).toBeGreaterThan(0.99);
  expect(sUastc, `UASTC SSIM ${sUastc} regressed`).toBeGreaterThan(0.995);
});
