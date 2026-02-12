import ru from "../../../public/locales/ru/common.json"
import en from "../../../public/locales/en/common.json"

export const messages = { ru, en } as const
export type Locale = keyof typeof messages
