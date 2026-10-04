import { expect, test } from '@playwright/test';

test('playground exposes the interaction lab', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Interaction Playground' })).toBeVisible();
  await expect(page.getByTestId('slider')).toBeVisible();
  await expect(page.getByTestId('xy-pad')).toBeVisible();
});

test('keyboard changes the slider value', async ({ page }) => {
  await page.goto('/');
  const slider = page.getByTestId('slider');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveAttribute('aria-valuenow', '53');
  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.up('Shift');
  await expect(slider).toHaveAttribute('aria-valuenow', '53');
});

test('pointer drag changes the slider value', async ({ page }) => {
  await page.goto('/');
  const slider = page.getByTestId('slider');
  const box = await slider.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;

  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width / 2, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.75, y);
  await page.mouse.up();

  const value = Number(await slider.getAttribute('aria-valuenow'));
  expect(value).toBeGreaterThan(50);
});
