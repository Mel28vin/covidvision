export function readImage(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => resolve(fileReader.result as string)
    fileReader.onerror = () => reject(fileReader.error)
    fileReader.readAsDataURL(file)
  })
}
