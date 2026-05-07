import AppKit
import CoreImage
import Foundation

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let inputDir = root.appendingPathComponent("assets/cubemap")
let outputDir = root.appendingPathComponent("assets/cubemap-hd")
let names = ["front", "back", "top", "bottom", "right", "left"]
let targetSize = 2048.0

try FileManager.default.createDirectory(at: outputDir, withIntermediateDirectories: true)

let context = CIContext(options: [.workingColorSpace: CGColorSpace(name: CGColorSpace.sRGB)!])
let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!

for name in names {
  let input = inputDir.appendingPathComponent("\(name).png")
  let output = outputDir.appendingPathComponent("\(name).png")
  guard let image = CIImage(contentsOf: input) else {
    fputs("Could not read \(input.path)\n", stderr)
    exit(1)
  }

  let extent = image.extent
  let scale = targetSize / max(extent.width, extent.height)
  let scaled = image
    .applyingFilter("CILanczosScaleTransform", parameters: [
      kCIInputScaleKey: scale,
      kCIInputAspectRatioKey: 1.0,
    ])
    .cropped(to: CGRect(x: 0, y: 0, width: targetSize, height: targetSize))

  let sharpened = scaled
    .applyingFilter("CIUnsharpMask", parameters: [
      kCIInputRadiusKey: 1.1,
      kCIInputIntensityKey: 0.36,
    ])
    .applyingFilter("CISharpenLuminance", parameters: [
      kCIInputSharpnessKey: 0.18,
    ])

  try context.writePNGRepresentation(
    of: sharpened,
    to: output,
    format: .RGB8,
    colorSpace: colorSpace
  )
  print("Wrote \(output.path)")
}
