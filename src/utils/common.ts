export function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export function put0x(data: string): string {
  if (!data.startsWith('0x')) {
    data = '0x' + data;
  }
  return data;
}

export function remove0x(data: string): string {
  if (data.startsWith('0x')) {
    data = data.substr(2);
  }
  return data;
}
