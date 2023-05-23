export function getExtensionByFilename(filename: string) {
  const regex = /\.[0-9a-z]+$/i
  const [extension] = regex.exec(filename)

  return extension.replace('.', '')
}
