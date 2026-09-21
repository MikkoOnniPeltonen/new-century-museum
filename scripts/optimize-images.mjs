// Converts the original portraits and notable-work images in assets-src/ into
// resized WebP files named by person id: public/images/<kind>/<id>-<width>.webp
import { mkdir, readdir, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const WIDTHS = [480, 960]

const SOURCES = {
  portraits: {
    dir: 'assets-src/images/portraits',
    files: {
      'sor-juana': 'Sor_Juana_Inés_de_la_Cruz.jpg',
      'isaac-newton': 'Isaac_Newton.jpg',
      'shah-abbas': 'Shah_Abbas_I.jpg',
      'queen-nzinga': 'Queen_Nzinga.jpg',
      'tokugawa-ieyasu': 'Tokugawa_Ieyasu.jpg',
      voltaire: 'Voltaire.jpg',
      'george-washington': 'George_Washington.jpg',
      'wang-zhenyi': 'Wang_Zhenyi.jpg',
      'ibrahim-muteferrika': 'Ibrahim_Muteferrika.jpg',
      'anton-amo': 'Anton_Wilhelm_Amo.jpg',
      napoleon: 'Napoleon_Bonaparte.jpg',
      bahaullah: "Bahá'u'lláh.jpg",
      'simon-bolivar': 'Simón_Bolívar.png',
      'liu-mingchuan': 'Liu_Mingchuan.jpg',
      'ada-lovelace': 'Ada_Lovelace.png',
      'albert-einstein': 'Albert_Einstein.jpg',
      'lech-walesa': 'Lech_Walesa.jpg',
      fdr: 'Franklin_D._Roosevelt.jpg',
      'nelson-mandela': 'Nelson_Mandela.jpg',
      gandhi: 'Mahatma_Gandhi.jpg',
    },
  },
  works: {
    dir: 'assets-src/images/notableWorks',
    files: {
      'sor-juana': 'Sor_Juana_Inés_de_la_Cruz_manuscript.jpeg',
      'isaac-newton': 'Isaac_Newton_mathematica.jpeg',
      'shah-abbas': 'Shah_Abbas_I_isfahan.jpg',
      'queen-nzinga': 'Queen_Nzinga_illustration.jpeg',
      'tokugawa-ieyasu': 'Tokugawa_Ieyasu_edo.jpg',
      voltaire: 'Voltaire_candide.png',
      'george-washington': 'George_Washington_river.jpeg',
      'wang-zhenyi': 'Wang_Zhenyi_astronomy.jpeg',
      'ibrahim-muteferrika': 'Ibrahim_Muteferrika_press.jpg',
      'anton-amo': 'Anton_Wilhelm_Amo_dissertatio.jpg',
      napoleon: 'Napoleon_Bonaparte_coronation.jpeg',
      bahaullah: 'Bahaullah_revelation.jpeg',
      'simon-bolivar': 'Simon_Bolivar_letter.jpg',
      'liu-mingchuan': 'Liu_Mingchuan_taiwan.jpg',
      'ada-lovelace': 'Ada_Lovelace_machine.jpeg',
      'albert-einstein': 'Albert_Einstein_relativity.jpg',
      'lech-walesa': 'Lech_Walesa_rally.jpeg',
      fdr: 'Franklin_D._Roosevelt_act.jpeg',
      'nelson-mandela': 'Nelson_Mandela_robben.jpeg',
      gandhi: 'Mahatma_Gandhi_march.jpeg',
    },
  },
}

let inputBytes = 0
let outputBytes = 0

for (const [kind, { dir, files }] of Object.entries(SOURCES)) {
  const sourceDir = join(root, dir)
  // Filenames with accents may be stored in either Unicode form on disk.
  const onDisk = new Map((await readdir(sourceDir)).map((name) => [name.normalize('NFC'), name]))
  const outDir = join(root, 'public/images', kind)
  await mkdir(outDir, { recursive: true })

  for (const [id, file] of Object.entries(files)) {
    const actual = onDisk.get(file.normalize('NFC'))
    if (!actual) throw new Error(`Missing source image for ${kind}/${id}: ${file}`)
    const input = join(sourceDir, actual)
    inputBytes += (await stat(input)).size

    for (const width of WIDTHS) {
      const output = join(outDir, `${id}-${width}.webp`)
      await sharp(input)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 })
        .toFile(output)
      outputBytes += (await stat(output)).size
    }
  }
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`
console.log(`Optimized images: ${mb(inputBytes)} of originals -> ${mb(outputBytes)} of WebP (all sizes)`)
