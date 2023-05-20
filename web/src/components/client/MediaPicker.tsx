'use client'

import { ChangeEvent, useState } from 'react'

interface Preview {
  url: string
  type: 'image' | 'video'
}

interface MediaPickerProps {
  preview?: Preview
  onChangeMedia: () => void
}

export function MediaPicker({ onChangeMedia }: MediaPickerProps) {
  const [preview, setPreview] = useState<Preview | null>(null)

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const file = files[0]

    if (!file.type.includes('image') && !file.type.includes('video')) {
      return
    }

    const fileType = file.type.includes('image') ? 'image' : 'video'

    const previewURL = URL.createObjectURL(file)

    setPreview({
      url: previewURL,
      type: fileType,
    })

    onChangeMedia()
  }

  return (
    <>
      <input
        type="file"
        id="media"
        name="media"
        accept="image/*,video/*"
        className="h-0 w-0"
        onChange={handleFileSelected}
      />

      {!!preview &&
        (preview.type === 'image' ? (
          // eslint-disable-next-line
          <img
            src={preview.url}
            alt=""
            className="aspect-video w-full rounded-lg object-cover"
          />
        ) : (
          <video
            src={preview.url}
            controls
            className="aspect-video w-full rounded-lg object-cover"
          />
        ))}
    </>
  )
}
