/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next"
import { type ChangeEvent, useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import Head from "next/head"
import Image from "next/image"
import Footer from "~/components/Footer"

const Home: NextPage = () => {
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
        const _model = await tf.loadLayersModel(
          "https://covid-donotdelete-pr-gyuplfpidshoah.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json"
        )
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
          const predictions = model.predict(finalTensor) as tf.Tensor
          if (!predictions) throw Error("Invalid prediction")
          const result = predictions.dataSync()[0]
          if (!result) throw Error("Invalid")
          setPrediction(result)
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
      <main className="my-16 flex min-h-screen flex-col items-center justify-start gap-10">
        <h2 className="text-bold text-3xl">
          Welcome to the COVIDVision Web App
        </h2>
        <p className="w-1/2 text-center">
          This is a web application built using NextJS and Tensorflowjs to
          accurately predict and classify CT Scans of any patients&apos;, Lungs
          as COVID / non-COVID
        </p>
        {!!model ? (
          <form className="Form">
            <label
              htmlFor="upload-image"
              className="flex cursor-pointer items-center gap-3 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-4"
            >
              <Image
                className="h-12 w-auto"
                src="/upload.webp"
                alt="Upload Image"
                height={50}
                width={50}
              />
              <div className="space-y-2">
                <h4 className="text-base font-semibold text-gray-700">
                  Upload a file
                </h4>
              </div>
              <input
                type="file"
                id="upload-image"
                name="upload-image"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={!model || processing}
                hidden
              />
            </label>
          </form>
        ) : (
          <div> Please wait as the model is loading... </div>
        )}
        {prediction && !processing ? (
          <div>
            The patient is {prediction >= 0.5 ? "not " : ""} diagnosed with
            Covid
          </div>
        ) : null}
        <div className="Img-display-container">
          {file ? (
            <div className="flex flex-col items-center gap-6">
              <div> Your Uploaded Image </div>
              <img
                onLoad={() => {
                  setImageLoaded(true)
                }}
                alt=""
                src={file}
              />
            </div>
          ) : null}
        </div>
      </main>
    </>
  )
}

export default Home
