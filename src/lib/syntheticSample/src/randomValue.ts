import crypto from "crypto";

export default function randomValue(
  min: number,
  max: number,
  bufferSize: number = 4
) {
  const range = max - min;
  const randomBuffer = crypto.randomBytes(bufferSize);
  const randomValue = (randomBuffer.readUInt32LE(0) / 0xffffffff) * range + min;
  return randomValue;
}
