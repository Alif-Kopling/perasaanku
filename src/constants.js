export const WA_PHONE = '6285134394748'

export const WA_MESSAGES = {
  suka: 'Wahh.. makasih ya buat bunganya, cantik banget.. dan soal pesan kamu, aku juga ngerasa hal yang sama kok.',
  pikir: 'Ehh.. makasih ya udah berani cerita ke aku. Tapi aku butuh waktu dulu buat mikirin nya, boleh kan??',
  gagal: 'Ehh.. makasih ya udah jujur sama aku. Tapi maaf aku belum bisa nerima perasaan kamu.. Kamu orang baik, jangan sedih yaa.',
}

export function getWaUrl(status) {
  const text = WA_MESSAGES[status] || WA_MESSAGES.suka
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`
}
