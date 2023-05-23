import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { extname, resolve } from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { FastifyReply, FastifyRequest } from 'fastify'

const pump = promisify(pipeline)

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const upload = await request.file({
    limits: {
      fileSize: 1024 * 1024 * 5, // 5mb
    },
  })

  if (!upload) {
    return reply.status(400).send({
      message: 'No file uploaded.',
    })
  }

  const mimeTypeRegex = /^(image|video)\/[a-z0-9]+$/
  const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

  if (!isValidFileFormat) {
    return reply.status(400).send({
      message: 'File type is not allowed, send only image or video.',
    })
  }

  const fileId = randomUUID()
  const extension = extname(upload.filename)

  const fileName = fileId.concat(extension)

  const writeStream = createWriteStream(
    resolve(__dirname, '../../uploads/', fileName),
  )

  await pump(upload.file, writeStream)

  const fullUrl = request.protocol.concat('://').concat(request.hostname)
  const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

  return reply.status(201).send({
    file_url: fileUrl,
  })
}
