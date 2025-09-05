import * as htmlToImage from 'html-to-image'
export async function downloadPNGFromNode(node: HTMLElement, filename: string) {
  const dataUrl = await htmlToImage.toPng(node, { cacheBust: true, quality: 1 })
  const link = document.createElement('a')
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`
  link.href = dataUrl
  link.click()
}