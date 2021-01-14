interface writeTagProps {
    write: string,
    onSuccess: () => void,
    onError: (error: string) => void
}

export const writeNfcTag = (props: writeTagProps) => {
    if ("NDEFReader" in window) {
        const ndef = new NDEFReader();
        ndef.write(props.write)
            .then(() => props.onSuccess())
            .catch(error => props.onError(`${error}`));
    } else {
        props.onError("Web NFC is not supported.");
    }
}