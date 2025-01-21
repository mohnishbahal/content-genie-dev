type ToastProps = {
  title: string;
  description?: string;
  duration?: number;
}

export const toast = (props: ToastProps) => {
  console.log('Toast:', props)
  // TODO: Implement actual toast functionality
  // For now, just logging to console
} 