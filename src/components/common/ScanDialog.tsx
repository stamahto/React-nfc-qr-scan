import React, { useState } from 'react';
import { Dialog, DialogContent, DialogContentText, Typography } from '@material-ui/core';
import { Nfc } from '@material-ui/icons';
import QrReader from 'react-qr-reader';

const language: string = localStorage.getItem("langCode") || 'en';
const approachAnNfcTag: string = language === "en" ? "Approach an NFC Tag" : "Přibliž zařízení k NFC";

interface ScanDialogProps {
    open: boolean,
    close: () => void,
    onScan: (value: string) => void
}

export default function ScanDialog(props: ScanDialogProps) {
    const [message, setMessage] = useState(approachAnNfcTag);

    const readNfcTag = () => {
        if ("NDEFReader" in window) {
            const ndef = new NDEFReader();
            ndef.scan().then(() => {
                ndef.onreading = event => {
                    const decoder = new TextDecoder();
                    for (const record of event.message.records) {
                        props.onScan(decoder.decode(record.data));
                        props.close();
                    }
                };
            }).catch(error => setMessage(`${error}`));
        } else {
            setMessage("Web NFC is not supported.");
        }
    }

    const readQrCode = (value: string | null) => {
        if (value) {
            props.onScan(value);
            props.close();
        }
    }

    return (
        <Dialog open={props.open} onClose={props.close} fullWidth onEnter={() => readNfcTag()}>
            <QrReader onError={(error) => alert(`${error}`)} onScan={(value: string | null) => readQrCode(value)} className="w-100" />

            <DialogContent>
                <DialogContentText className="mb-0 text-center text-break">
                    <Typography><Nfc /> {message}</Typography>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}