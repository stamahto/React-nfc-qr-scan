import React, { useEffect, useState } from 'react';
import { AppBar, Dialog, DialogContent, DialogContentText, Fab, Tab, Tabs } from '@material-ui/core';
import { Nfc } from '@material-ui/icons';
import QrReader from 'react-qr-reader';

import { readNfcTag } from '../../utils/Helpers';

const language: string = localStorage.getItem("langCode") || 'en';
const approachAnNfcTag: string = language === "en" ? "Approach an NFC Tag" : "Přibliž zařízení k NFC";

interface ScanDialogProps {
    open: boolean,
    close: () => void,
    onScan: (value: string) => void
}

export default function ScanDialog(props: ScanDialogProps) {
    const [selectedOption, setSelectedOption] = useState("QR");
    const [message, setMessage] = useState(approachAnNfcTag);

    useEffect(() => {
        if (selectedOption === "NFC")
            readNfcTag({
                onSuccess: (data) => { props.onScan(data); props.close() },
                onError: (message) => setMessage(message)
            });

        // eslint-disable-next-line
    }, [selectedOption]);

    const readQrCode = (value: string | null) => {
        if (value) {
            props.onScan(value);
            props.close();
        }
    }

    const returnSelectedOptionNumber = () => {
        if (selectedOption === "QR")
            return 0;
        else
            return 1;
    }

    return (
        <Dialog open={props.open} onClose={props.close} fullWidth>
            <AppBar position="static">
                <Tabs value={returnSelectedOptionNumber()} centered>
                    <Tab label="QR" onClick={() => setSelectedOption("QR")} />
                    <Tab label="NFC" onClick={() => setSelectedOption("NFC")} />
                </Tabs>
            </AppBar>

            {selectedOption === "QR" &&
                <QrReader onError={() => alert("QR scan error")} onScan={(e: string | null) => readQrCode(e)} className="w-100" />
            }

            {selectedOption === "NFC" &&
                <DialogContent>
                    <DialogContentText className="d-flex justify-content-center">
                        <Fab className="my-2">
                            <Nfc fontSize="large" />
                        </Fab>
                    </DialogContentText>
                    <h5 className="text-center">{message}</h5>
                </DialogContent>
            }
        </Dialog>
    )
}
