import { andGateNInp, inverter, orGateNInp } from "../../virtual-machine/C.P.U/gates";
import { mux32to1 } from "../../virtual-machine/C.P.U/mux_demux";
import type { Bit, Bit32, Bit5 } from "../../virtual-machine/types";
import { decimalToBinary } from "../../virtual-machine/utils/convertion";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";

export class Selector32to1Circuit extends LevelledCircuit {
    private totalDataInput = 32;
    private totalSelectInput = 5;

    private inpDataBit: Bit32 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    private inpSelectBit: Bit5 = [0, 0, 0, 0, 0];

    private finalOut: Bit = 0;


    // =========================================================
    // INPUT DATA
    // =========================================================

    private inpDataBitLabels: TextResult[] = Array.from({length: this.totalDataInput});
    private inpDatatWires: WireResult[] = Array.from({length: this.totalDataInput});
    
    // =========================================================
    // INPUT SELECT
    // =========================================================

    private inpSelectBitLabels: TextResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectWires: WireResult[][] = Array.from({length: this.totalSelectInput});
    private inpSelectConns: ConnectorResult[][] = Array.from({length: this.totalSelectInput});

    private inpSelectInvWires: WireResult[][] = Array.from({length: this.totalSelectInput});
    private inpSelectInvConns: ConnectorResult[][] = Array.from({length: this.totalSelectInput});

    // =========================================================
    // AND OUTPUT
    // =========================================================

    private andOutWires: WireResult[][] = Array.from({length: this.totalDataInput});

    // =========================================================
    // OUTPUT
    // =========================================================

    private outBitLabel!: TextResult;
    private outWire!: WireResult;
    private outConn!: ConnectorResult;

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
                x: 530,
                y: 1865,
            },
            {
                width: 1550,
                height: 3350,
            }
        );

        this.view.addText(
            {
                x: 530,
                y: 1865,
            },
            "32 X 1 Selector",
            {
                fontSize: 300,
                orientation: "vert",
            }
        );

        const selWireXShift = 150;
        for (let i = 0; i < this.totalSelectInput; i++) {

            this.view.addText(
                {
                    x: -200 + (i * selWireXShift),
                    y: 230,
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
                    40,
                    "vert",
                ),
            ];

            this.inpSelectConns[i] = [
               
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
        for (let i = 0; i < this.totalDataInput; i++) {

            this.inpDatatWires[i] = this.view.addWire(
                {
                    x: -320,
                    y: 385 + (i * decodedOutShiftY),
                },
                75,
                "horz",
            );

            if (!this.hideConnAndSwitch) {
                const inpData = this.view.addSwitch(
                    {
                        x: -320,
                        y: 385 + (i * decodedOutShiftY),
                    },
                    12,
                    (bit) => {
                        this.inpDataBit[i] = bit;
                        this.update();
                    }
                );

                this.view.setSwitchBit(inpData.switchId, this.inpDataBit[i]);
            }

            this.view.addText(
                {
                    x: -200,
                    y: 385 + (i * decodedOutShiftY),
                },
                `D${i}`,
                {fontSize: 40},
            );

            if (!this.hideConnAndSwitch) {

                this.inpDataBitLabels[i] = this.view.addText(
                    {
                        x: -300,
                        y: 350 + (i * decodedOutShiftY),
                    },
                    "",
                    {fontSize: 40},
                );
            }
        }

        this.outWire = this.view.addWire(
            {
                x: 1305,
                y: 1900,
            },
            80 - 13,
            "horz",
        );

        this.view.addText(
            {
                x: 1270,
                y: 1900,
            },
            "Q",
            {fontSize: 40},
        );

        if (!this.hideConnAndSwitch) {
            this.outConn = this.view.addConnector(
                {
                    x: 1292 + 80,
                    y: 1900,
                },
            );

            this.outBitLabel = this.view.addText(
                {
                    x: 1362,
                    y: 1870,
                },
                "",
                {fontSize: 40},
            );
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
        for (let i = 0; i < this.totalDataInput; i++) {

            this.inpDatatWires[i] = this.view.addWire(
                {
                    x: -320,
                    y: 385 + (i * decodedOutShiftY),
                },
                901,
                "horz",
            );

            if (!this.hideConnAndSwitch) {
                const inpData = this.view.addSwitch(
                    {
                        x: -320,
                        y: 385 + (i * decodedOutShiftY),
                    },
                    12,
                    (bit) => {
                        this.inpDataBit[i] = bit;
                        this.update();
                    }
                );

                this.view.setSwitchBit(inpData.switchId, this.inpDataBit[i]);
            }

            if (!this.hideConnAndSwitch) {
                this.view.addText(
                    {
                        x: -400,
                        y: 385 + (i * decodedOutShiftY),
                    },
                    `D${i}`,
                    {fontSize: 40},
                );

                this.inpDataBitLabels[i] = this.view.addText(
                    {
                        x: -300,
                        y: 350 + (i * decodedOutShiftY),
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
                    height: 90,
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

            const xOut = 350 - ((i - (i > 15 ? (2*(i % 16) + 1) : 0)) * 20);
            const yOut = 1300 - (i * 83.7);

            this.andOutWires[i] = [
                this.view.addWire(
                    {
                        x: 658,
                        y: 350 + (i * decodedOutShiftY),
                    },
                    xOut,
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: 658 + xOut,
                        y: 350 + (i * decodedOutShiftY),
                    },
                    yOut,
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 658 + xOut,
                        y: 350 + (i * decodedOutShiftY) + yOut,
                    },
                    460 - xOut,
                    "horz",
                ),
            ];
        }

        this.view.addOrGate(
            {
                x: 1170,
                y: 1900,
            },
            {
                width: 240,
                height: 550,
            }
        );

        this.outWire = this.view.addWire(
            {
                x: 1292,
                y: 1900,
            },
            80,
            "horz",
        );

        if (!this.hideConnAndSwitch) {
            this.outConn = this.view.addConnector(
                {
                    x: 1292 + 80,
                    y: 1900,
                },
            );

            this.view.addText(
                {
                    x: 1420,
                    y: 1900,
                },
                "Q",
                {fontSize: 40},
            );

            this.outBitLabel = this.view.addText(
                {
                    x: 1362,
                    y: 1870,
                },
                "",
                {fontSize: 40},
            );
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

        for (let i = 0; i < this.totalDataInput; i++) {
            const dataBit = this.inpDataBit[i];
            this.setSignal(
                dataBit,
                [this.inpDatatWires[i]],
                [],
            );

            if (this.inpDataBitLabels[i]) this.view.setTextBitAnimated(this.inpDataBitLabels[i].textId, dataBit)
        }

        const outBit = mux32to1(this.inpDataBit, this.inpSelectBit);
        this.finalOut = outBit;
        this.setSignal(
            outBit,
            [this.outWire],
            this.outConn ? [this.outConn] : [],
        );

        if (this.outBitLabel) this.view.setTextBitAnimated(this.outBitLabel.textId, outBit);
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

        const andOutBits: Bit[] = [];
        for (let i = 0; i < this.totalDataInput; i++) {
            const dataBit = this.inpDataBit[i];
            this.setSignal(
                dataBit,
                [this.inpDatatWires[i]],
                [],
            );

            if (this.inpDataBitLabels[i]) this.view.setTextBitAnimated(this.inpDataBitLabels[i].textId, dataBit)

            const [sel0, sel1, sel2, sel3, sel4] = decimalToBinary(i, 5) as Bit5;
            const andOut = andGateNInp( [
                dataBit,
                sel0 <= 0 ? inverter(this.inpSelectBit[0]) : this.inpSelectBit[0],
                sel1 <= 0 ? inverter(this.inpSelectBit[1]) : this.inpSelectBit[1],
                sel2 <= 0 ? inverter(this.inpSelectBit[2]) : this.inpSelectBit[2],
                sel3 <= 0 ? inverter(this.inpSelectBit[3]) : this.inpSelectBit[3],
                sel4 <= 0 ? inverter(this.inpSelectBit[4]) : this.inpSelectBit[4],
            ] );
            this.setSignal(
                andOut,
                this.andOutWires[i],
                [],
            );

            andOutBits.push(andOut);
        }

        const outBit = orGateNInp(andOutBits);
        this.finalOut = outBit;
        this.setSignal(
            outBit,
            [this.outWire],
            this.outConn ? [this.outConn] : [],
        );

        if (this.outBitLabel) this.view.setTextBitAnimated(this.outBitLabel.textId, outBit);
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

    setInputs(inpData: Bit32, inpSelect: Bit5): Bit {
        this.inpDataBit = inpData;
        this.inpSelectBit = inpSelect;
        this.update();
        return this.finalOut;
    }
}