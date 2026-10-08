import { inverter } from "../../virtual-machine/C.P.U/gates";
import { decoder5to32 } from "../../virtual-machine/C.P.U/mux_demux";
import type { Bit, Bit32, Bit5 } from "../../virtual-machine/types";
import { decimalToBinary } from "../../virtual-machine/utils/convertion";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";

export class Decoder5to32Circuit extends LevelledCircuit {

    private totalDecodedOut = 32;
    private totalSelectInput = 5;

    private inpSelectBit: Bit5 = [0, 0, 0, 0, 0];

    private finalOut: Bit32 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];

    
    // =========================================================
    // INPUT SELECT
    // =========================================================

    private inpSelectBitLabels: TextResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectWires: WireResult[][] = Array.from({length: this.totalSelectInput});
    private inpSelectConns: ConnectorResult[][] = Array.from({length: this.totalSelectInput});

    private inpSelectInvWires: WireResult[][] = Array.from({length: this.totalSelectInput});
    private inpSelectInvConns: ConnectorResult[][] = Array.from({length: this.totalSelectInput});

    // =========================================================
    // OUTPUT
    // =========================================================

    private outBitLabels: TextResult[] = Array.from({length: this.totalDecodedOut});
    private outWires: WireResult[] = Array.from({length: this.totalDecodedOut});
    private outConns: ConnectorResult[] = Array.from({length: this.totalDecodedOut});

    private hideConnAndSwitch: boolean;

    constructor(hide = false) {

        super(1);

        this.hideConnAndSwitch = hide;

        this.build();

        this.update();
    }

    getMaxLevel() {
        return this.maxLevel;
    }

    // =========================================================
    // BUILD
    // =========================================================

    protected build(): void {
        switch (this.level) {
            case 0:
                this.build0();
                break;
            case 1:
                this.build1();
                break;
        }
    }

    // =========================================================
    // UPDATE
    // =========================================================

    protected update(): void {
        switch (this.level) {
            case 0:
                this.update0();
                break;
            case 1:
                this.update1();
                break;
        }
        
    }

    private build0() {

        this.view.addBox(
            {
                x: 200,
                y: 1865,
            },
            {
                width: 950,
                height: 3350,
            }
        );

        this.view.addText(
            {
                x: 200,
                y: 1865,
            },
            "5 to 32 Decoder",
            {
                fontSize: 200,
                orientation: "vert",
            },
        );

        const selWireXShift = 150;
        for (let i = 0; i < this.totalSelectInput; i++) {

            this.view.addText(
                {
                    x: -200 + (i * selWireXShift),
                    y: 235,
                },
                `S${i}`,
                {fontSize: 40},
            );

            if (!this.hideConnAndSwitch) {
                this.inpSelectBitLabels[i] =  this.view.addText(
                    {
                        x: -170 + (i * selWireXShift),
                        y: 160,
                    },
                    "",
                    {fontSize: 30},
                );
            }

            this.inpSelectWires[i] = [
                this.view.addWire(
                    {
                        x: -200 + (i * selWireXShift),
                        y: 150,
                    },
                    37,
                    "vert",
                ),
            ];

            this.inpSelectConns[i] = [
            ];

            this.inpSelectInvConns[i] = [];


            if (!this.hideConnAndSwitch) {
                const inpSwitch = this.view.addSwitch(
                    {
                        x: -200 + (i * selWireXShift),
                        y: 150,
                    },
                    12,
                    (bit) => {
                        this.inpSelectBit[i] = bit;
                        this.update();
                    }
                );

                this.view.setSwitchBit(inpSwitch.switchId, this.inpSelectBit[i]);
            }
        }

        const decodedOutShiftY = 100;
        for (let i = 0; i < this.totalDecodedOut; i++) {

            this.view.addText(
                {
                    x: 620,
                    y: 350 + (i * decodedOutShiftY),
                },
                `D${i}`,
                {fontSize: 40},
            );

            if (!this.hideConnAndSwitch) {
                this.outBitLabels[i] = this.view.addText(
                    {
                        x: 720,
                        y: 320 + (i * decodedOutShiftY),
                    },
                    "",
                    {fontSize: 40},
                );
            }

            this.outWires[i] = this.view.addWire(
                {
                    x: 678,
                    y: 350 + (i * decodedOutShiftY)
                },
                60,
                "horz",
            );

            if (!this.hideConnAndSwitch) {
                this.outConns[i] = this.view.addConnector(
                    {
                        x: 658 + 80,
                        y: 350 + (i * decodedOutShiftY)
                    },
                );
            }
        }

    }

    private build1() {

        const selWireXShift = 150;
        for (let i = 0; i < this.totalSelectInput; i++) {

            if (!this.hideConnAndSwitch) {
                this.view.addText(
                    {
                        x: -200 + (i * selWireXShift),
                        y: 100,
                    },
                    `S${i}`,
                    {fontSize: 40},
                );

                this.inpSelectBitLabels[i] =  this.view.addText(
                    {
                        x: -170 + (i * selWireXShift),
                        y: 160,
                    },
                    "",
                    {fontSize: 30},
                );                
            }

            this.inpSelectWires[i] = [
                this.view.addWire(
                    {
                        x: -200 + (i * selWireXShift),
                        y: 150,
                    },
                    3320 - (i * 12),
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: -200 + (i * selWireXShift),
                        y: 200,
                    },
                    75,
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: -125 + (i * selWireXShift),
                        y: 200,
                    },
                    50,
                    "vert",
                ),
            ];

            this.inpSelectConns[i] = [
                this.view.addConnector(
                    {
                        x: -200 + (i * selWireXShift),
                        y: 200,
                    },
                ),
            ];

            this.inpSelectInvConns[i] = [];

            this.view.addNotGate(
                {
                    x: -125 + (i * selWireXShift),
                    y: 268,
                },
                {
                    width: 30,
                    height: 30,
                },
                true,
                "down",
            );

            this.inpSelectInvWires[i] = [
                this.view.addWire(
                    {
                        x: -125 + (i * selWireXShift),
                        y: 305,
                    },
                    1565 + (100 * (16 - 2 ** (4 - i))) - (i * 12),
                    "vert",
                ),
            ];

            if (!this.hideConnAndSwitch) {
                const inpSwitch = this.view.addSwitch(
                    {
                        x: -200 + (i * selWireXShift),
                        y: 150,
                    },
                    12,
                    (bit) => {
                        this.inpSelectBit[i] = bit;
                        this.update();
                    }
                );

                this.view.setSwitchBit(inpSwitch.switchId, this.inpSelectBit[i]);
            }
        }

        const decodedOutShiftY = 100;
        for (let i = 0; i < this.totalDecodedOut; i++) {

            if (!this.hideConnAndSwitch) {
                this.view.addText(
                    {
                        x: 800,
                        y: 350 + (i * decodedOutShiftY),
                    },
                    `D${i}`,
                    {fontSize: 40},
                );

                this.outBitLabels[i] = this.view.addText(
                    {
                        x: 720,
                        y: 320 + (i * decodedOutShiftY),
                    },
                    "",
                    {fontSize: 40},
                );
            }

            this.view.addAndGate(
                {
                    x: 620,
                    y: 350 + (i * decodedOutShiftY),
                },
                {
                    width: 70,
                    height: 70,
                },
            );

            const iBin = decimalToBinary(i, 5) as Bit5;

            for (let j = 0; j < this.totalSelectInput; j++) {
                const selX = -200 + (j * selWireXShift);
                const selInvX = -125 + (j * selWireXShift);

                const selY = 370 + (i * decodedOutShiftY) - (j * 12);
                const selLen = 581 - selX;
                const selInvLen = 581 - selInvX;

                if (iBin[j] === 0) {
                    this.inpSelectInvWires[j].push(
                        this.view.addWire(
                            {
                                x: selInvX,
                                y: selY,
                            },
                            selInvLen,
                            "horz",
                        ),
                    );

                    this.inpSelectInvConns[j].push(
                        this.view.addConnector(
                            {
                                x: selInvX,
                                y: selY,
                            },
                        ),
                    );
                } else {
                    this.inpSelectWires[j].push(
                        this.view.addWire(
                            {
                                x: selX,
                                y: selY,
                            },
                            selLen,
                            "horz",
                        ),
                    );

                    this.inpSelectConns[j].push(
                        this.view.addConnector(
                            {
                                x: selX,
                                y: selY,
                            },
                        ),
                    );
                }
            }

            this.outWires[i] = this.view.addWire(
                {
                    x: 658,
                    y: 350 + (i * decodedOutShiftY)
                },
                80,
                "horz",
            );

            if (!this.hideConnAndSwitch) {
                this.outConns[i] = this.view.addConnector(
                    {
                        x: 658 + 80,
                        y: 350 + (i * decodedOutShiftY)
                    },
                );
            }
        }

    }

    private update0() {
        for (let i = 0; i < this.totalSelectInput; i++) {
            const sel = this.inpSelectBit[i];
            this.setSignal(
                sel,
                this.inpSelectWires[i],
                this.inpSelectConns[i],
            );

            if (this.inpSelectBitLabels[i]) this.view.setTextBitAnimated(this.inpSelectBitLabels[i].textId, sel);
        }

        const decodedData = decoder5to32(this.inpSelectBit);
        this.finalOut = decodedData;
        for (let i = 0; i < this.totalDecodedOut; i++) {
            this.setSignal(
                decodedData[i],
                [this.outWires[i]],
                this.outConns[i] ? [this.outConns[i]] : [],
            );

            if (this.outBitLabels[i]) this.view.setTextBitAnimated(this.outBitLabels[i].textId, decodedData[i]);
        }
    }

    private update1() {
        for (let i = 0; i < this.totalSelectInput; i++) {
            const sel = this.inpSelectBit[i];
            this.setSignal(
                sel,
                this.inpSelectWires[i],
                this.inpSelectConns[i],
            );

            if (this.inpSelectBitLabels[i]) this.view.setTextBitAnimated(this.inpSelectBitLabels[i].textId, sel);

            const selInv = inverter(sel);
            this.setSignal(
                selInv,
                this.inpSelectInvWires[i],
                this.inpSelectInvConns[i],
            );
        }

        const decodedData = decoder5to32(this.inpSelectBit);
        this.finalOut = decodedData;
        for (let i = 0; i < this.totalDecodedOut; i++) {
            this.setSignal(
                decodedData[i],
                [this.outWires[i]],
                this.outConns[i] ? [this.outConns[i]] : [],
            );

            if (this.outBitLabels[i]) this.view.setTextBitAnimated(this.outBitLabels[i].textId, decodedData[i]);
        }
    }

    // =========================================================
    // SIGNAL HELPER
    // =========================================================

    private setSignal(
        bit: Bit,
        wires: WireResult[],
        connectors: ConnectorResult[],
    ): void {

        for (
            const wire
            of wires
        ) {

            this.view.setWireBit(
                wire.wireId,
                bit,
            );
        }

        for (
            const connector
            of connectors
        ) {

            this.view.setConnectorBit(
                connector.connectorId,
                bit,
            );
        }
    }

    setInputs(inpSelect: Bit5): Bit32 {
        this.inpSelectBit = inpSelect;
        this.update();
        return this.finalOut;
    }
}