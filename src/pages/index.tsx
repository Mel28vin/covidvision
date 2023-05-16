/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next"
import { type ChangeEvent, useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import Head from "next/head"
import Header from "../components/Header"

// import { api } from "~/utils/api"

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [model, setModel] = useState<tf.LayersModel | null>(null)
  const [file, setFile] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [prediction, setPrediction] = useState<number | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length <= 0) throw Error("No files chosen")
    const _file = input.files[0]

    if (!_file) throw Error("Invalid File")
    setSelectedImage(URL.createObjectURL(_file))

    const fileData = await readImage(_file)
    setFile(fileData)
    setProcessing(true)
  }

  function readImage(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = () => resolve(fileReader.result as string)
      fileReader.onerror = () => reject(fileReader.error)
      fileReader.readAsDataURL(file)
    })
  }

  useEffect(() => {
    async function loadModel() {
      if (!model) {
        const _model = await tf.loadLayersModel("/assets/tfjs/model.json")
        setModel(_model)
      }
    }
    void loadModel()
  })

  useEffect(() => {
    function predict() {
      if (imageLoaded && file && model) {
        const imageElement = document.createElement("img")
        imageElement.src = file

        imageElement.onload = () => {
          const tensor = tf.browser
            .fromPixels(imageElement, 1)
            .resizeBilinear([150, 150])
            .div(255)
            .expandDims()
            .toFloat()

          const finalTensor = tf.concat([tensor, tensor, tensor], 3)
          const predictions = model.predict(finalTensor)
          console.log(predictions)
          console.log(predictions.dataSync())

          // setPrediction(parseInt(predictions, 10));
          setProcessing(false)
          setImageLoaded(false)
        }
      }
    }
    void predict()
  }, [imageLoaded, model, file])

  return (
    <>
      <Head>
        <title>Covidvision</title>
        <meta name="description" content="A Covid-19 prediction web-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <p className="text-2xl text-red-700">
          Hola
          {/* {hello.data ? hello.data.greeting : "Loading tRPC query..."} */}
        </p>
        <form className="Form">
          <label htmlFor="upload-image">Upload image</label>
          <input
            id="image-selector"
            type="file"
            name="upload-image"
            accept="image/*"
            className="File-selector"
            onChange={handleImageUpload}
            disabled={!model || processing}
          />
        </form>
        <div className="Img-display-container">
          {file ? (
            <img
              onLoad={() => {
                setImageLoaded(true)
              }}
              alt=""
              src={file}
            />
          ) : null}
        </div>
      </main>
    </>
  )
}

export default Home
