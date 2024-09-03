interface IPasswordGenerationState {
  password?: string
  confirmPassword?: string
  status: "initial" | "created" | "confirming"
  prevChatId?: number
}

export const passwordGenerationState = new Map<
  number,
  IPasswordGenerationState
>()
