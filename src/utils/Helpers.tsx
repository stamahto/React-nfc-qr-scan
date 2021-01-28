declare global {
    interface Window {
        NDEFReader: any,
        NDEFWriter: any
    }
}

interface writeNfcTagProps {
    write: string,
    onSuccess: () => void,
    onError: (error: string) => void
}

export const writeNfcTag = (props: writeNfcTagProps) => {
    if ("NDEFReader" in window) {
        const ndef = new window.NDEFWriter();
        ndef.write(props.write)
            .then(() => props.onSuccess())
            .catch((error: any) => props.onError(`${error}`));
    } else {
        props.onError("Web NFC is not supported.");
    }
}

interface readNfcTagProps {
    onSuccess: (data: string) => void,
    onError: (error: string) => void
}

export const readNfcTag = (props: readNfcTagProps) => {
    if ("NDEFReader" in window) {
        const ndef = new window.NDEFReader();
        ndef.scan().then(() => {
            ndef.onreadingerror = () => {
                props.onError("Cannot read data from the NFC tag.");
            };
            ndef.onreading = (event: any) => {
                const decoder = new TextDecoder();
                for (const record of event.message.records) {
                    props.onSuccess(decoder.decode(record.data));
                }
            };
        }).catch((error: any) => {
            props.onError(`Error! Scan failed to start: ${error}.`);
        });
    } else {
        props.onError("Web NFC is not supported.");
    }
}
