import { mux2To1 } from "../../virtual-machine/C.P.U/mux_demux";
import type { Bit, Bit8 } from "../../virtual-machine/types";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";
import { Selector2to1Circuit } from "./Selector2to1";

export class Selector8Bit2to1Circuit extends LevelledCircuit {
    private inpLen = 8;
    private selectLen = 1;

    private inp1Bits = Array.from({length: this.inpLen}).fill(0) as Bit8;
    private inp2Bits = Array.from({length: this.inpLen}).fill(0) as Bit8;

    private selectBits = Array.from({length: this.selectLen}).fill(0) as [s0: Bit];

    private mux2to1: Selector2to1Circuit[] = Array.from({length: this.selectLen});

    private selectWire!: WireResult;
    private selectWiresvh: WireResult[][] = Array.from({length: this.inpLen});
    private selectConns: ConnectorResult[] = Array.from({length: this.inpLen});

    private inp1Wires: WireResult[][] = Array.from({length: this.inpLen});
    private inp2Wires: WireResult[][] = Array.from({length: this.inpLen});

    private outputWires: WireResult[] = Array.from({length: this.inpLen});
    private outputConns: ConnectorResult[] = Array.from({length: this.inpLen});

    private inp1BitLabels: TextResult[] = Array.from({length: this.inpLen});
    private inp2BitLabels: TextResult[] = Array.from({length: this.inpLen});

    private inp1Label: TextResult[] = Array.from({length: this.inpLen});
    private inp2Label: TextResult[] = Array.from({length: this.inpLen});

    private selectBitLabel: TextResult[] = Array.from({length: this.selectLen});
    private selectLabel: TextResult[] = Array.from({length: this.selectLen});

    private outputBitLabel: TextResult[] = Array.from({length: this.inpLen});
    private outputLabel: TextResult[] = Array.from({length: this.inpLen});


    private finalOut: Bit8 = Array.from({length: this.inpLen}).fill(0) as Bit8;

    private hideConnAndSwitch: boolean;

    constructor(hide = false) {

        super(2);

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
            case 2:
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
            case 2:
                this.update1();
                break;
        }
        
    }

    private build0() {

        this.view.addBox(
            {
                x: 825,
                y: 1030,
            },
            {
                width: 550,
                height: 1700,
            }
        );

        this.view.addText(
            {
                x: 825,
                y: 1030,
            },
            "8 Bit 2-to-1 Selector",
            {
                fontSize: 70,
                orientation: "vert"
            }
        );

        this.selectWire = this.view.addWire(
            {
                x: 1050,
                y: 85,
            },
            95,
            "vert",
        );

        this.selectLabel[0] = this.view.addText(
            {
                x: 1050,
                y: 210,
            },
            "S0",
            {fontSize: 30}
        );

        if (!this.hideConnAndSwitch) {
            this.selectBitLabel[0] = this.view.addText(
                {
                    x: 1080,
                    y: 70,
                },
                "",
                {fontSize: 30}
            );
        }

        if (!this.hideConnAndSwitch) {
            const selectSwitch = this.view.addSwitch(
                {
                    x: 1050,
                    y: 85,
                },
                12,
                (bit) => {
                    this.selectBits = [bit];
                    this.update();
                },
            );

            this.view.setSwitchBit(selectSwitch.switchId, this.selectBits[0]);
        }

        const shiftYBy = 220;
        for (let i = 0; i < this.inpLen; i++) {
            this.inp1Wires[i] = [
                this.view.addWire(
                    {
                        x: 400,
                        y: 225 + ((shiftYBy - 120) * i)
                    },
                    150,
                    "horz",
                ),
            ];

            this.inp2Wires[i] = [
                this.view.addWire(
                    {
                        x: 400,
                        y: 1115 + ((shiftYBy - 120) * i)
                    },
                    150,
                    "horz",
                ),
            ];


            this.outputWires[i] = this.view.addWire(
                {
                    x: 1100,
                    y: 250 + (shiftYBy * i),
                },
                100,
                "horz",
            );

            this.inp1Label[i] = this.view.addText(
                {
                    x: 590,
                    y: 225 + ((shiftYBy - 120) * i) 
                },
                `A${i}`,
                {fontSize: 30}
            );

            this.inp2Label[i] = this.view.addText(
                {
                    x: 590,
                    y: 1120 + ((shiftYBy - 120) * i) 
                },
                `B${i}`,
                {fontSize: 30}
            );

            this.outputLabel[i] = this.view.addText(
                {
                    x: 753 + 250 + 60,
                    y: 260 + (shiftYBy * i),
                },
                `R${i}`,
                {fontSize: 30}
            );

            if (!this.hideConnAndSwitch) {
                this.inp1BitLabels[i] = this.view.addText(
                    {
                        x: 410,
                        y: 190 + ((shiftYBy - 120) * i) 
                    },
                    "",
                    {fontSize: 30}
                );

                this.inp2BitLabels[i] = this.view.addText(
                    {
                        x: 410,
                        y: 1080 + ((shiftYBy - 120) * i) 
                    },
                    "",
                    {fontSize: 30}
                );

                this.outputBitLabel[i] = this.view.addText(
                    {
                        x: 943 + 250,
                        y: 220 + (shiftYBy * i),
                    },
                    "",
                    {fontSize: 30}
                );
            }

            if (!this.hideConnAndSwitch) {
                this.outputConns[i] = this.view.addConnector(
                    {
                        x: 953 + 250,
                        y: 250 + (shiftYBy * i),
                    },
                );

                const inp1Switch = this.view.addSwitch(
                    {
                        x: 400,
                        y: 225 + ((shiftYBy - 120) * i)
                    },
                    12,
                    (bit) => {
                        this.inp1Bits[i] = bit;
                        this.update();
                    }
                );

                const inp2Switch = this.view.addSwitch(
                    {
                       x: 400,
                       y: 1115 + ((shiftYBy - 120) * i)
                    },
                    12,
                    (bit) => {
                        this.inp2Bits[i] = bit;
                        this.update();
                    }
                );

                this.view.setSwitchBit(inp1Switch.switchId, this.inp1Bits[i]);
                this.view.setSwitchBit(inp2Switch.switchId, this.inp2Bits[i]);
            }
        }
    }

    private build1() {
        const level = this.level;

        this.selectWire = this.view.addWire(
            {
                x: 1050,
                y: 85,
            },
            1595,
            "vert",
        );

        if (!this.hideConnAndSwitch) {
            this.selectBitLabel[0] = this.view.addText(
                {
                    x: 1080,
                    y: 70,
                },
                "",
                {fontSize: 30}
            );

            this.selectLabel[0] = this.view.addText(
                {
                    x: 1050,
                    y: 40,
                },
                "S0",
                {fontSize: 30}
            );
        }

        if (!this.hideConnAndSwitch) {
            const selectSwitch = this.view.addSwitch(
                {
                    x: 1050,
                    y: 85,
                },
                12,
                (bit) => {
                    this.selectBits = [bit];
                    this.update();
                },
            );

            this.view.setSwitchBit(selectSwitch.switchId, this.selectBits[0]);
        }

        const shiftYBy = 220;
        for (let i = 0; i < this.inpLen; i++) {
            this.mux2to1[i] = new Selector2to1Circuit(true);
            this.mux2to1[i].setLevel(level - 1, false);
            this.mux2to1[i].getView.moveBy(600, 100 + (shiftYBy * i));
            this.mux2to1[i].getView.resize(.5);
            this.view.element.appendChild(this.mux2to1[i].element);

            this.selectWiresvh[i] = [
                this.view.addWire(
                    {
                        x: 1050,
                        y: 140 + (shiftYBy * i),
                    },
                    -150,
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: 1050 - 150,
                        y: 140 + (shiftYBy * i),
                    },
                    33,
                    "vert",
                ),
            ];

            this.selectConns[i] = this.view.addConnector(
                {
                    x: 1050,
                    y: 140 + (shiftYBy * i),
                },
                i >= this.inpLen - 1 ? 0 : undefined,
            );

            this.inp1Wires[i] = [
                this.view.addWire(
                    {
                        x: 400,
                        y: 225 + ((shiftYBy - 120) * i)
                    },
                    350 - (30 * i),
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: 400 + 350 - (30 * i),
                        y: 225 + ((shiftYBy - 120) * i)
                    },
                    (shiftYBy - 100) * i,
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 400 + 350 - (30 * i),
                        y: 225 + ((shiftYBy - 120) * i) + ((shiftYBy - 100) * i)
                    },
                    98 + (30 * i),
                    "horz",
                ),
            ];

            this.inp2Wires[i] = [
                this.view.addWire(
                    {
                        x: 400,
                        y: 1115 + ((shiftYBy - 120) * i)
                    },
                    120 + (30 * i),
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: 400 + 120 + (30 * i),
                        y: 1115 + ((shiftYBy - 120) * i)
                    },
                    -(shiftYBy - 100) * (this.inpLen - (i + 1)),
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 400 + 120 + (30 * i),
                        y: 1115 + ((shiftYBy - 120) * i) - (shiftYBy - 100) * (this.inpLen - (i + 1))
                    },
                    57 + (30 * ( this.inpLen - i + 1)),
                    "horz",
                ),
            ];


            this.outputWires[i] = this.view.addWire(
                {
                    x: 953,
                    y: 250 + (shiftYBy * i),
                },
                250,
                "horz",
            );

            if (!this.hideConnAndSwitch) {
                this.inp1BitLabels[i] = this.view.addText(
                    {
                        x: 410,
                        y: 190 + ((shiftYBy - 120) * i) 
                    },
                    "",
                    {fontSize: 30}
                );

                this.inp1Label[i] = this.view.addText(
                    {
                        x: 340,
                        y: 225 + ((shiftYBy - 120) * i) 
                    },
                    `A${i}`,
                    {fontSize: 30}
                );

                this.inp2BitLabels[i] = this.view.addText(
                    {
                        x: 410,
                        y: 1080 + ((shiftYBy - 120) * i) 
                    },
                    "",
                    {fontSize: 30}
                );

                this.inp2Label[i] = this.view.addText(
                    {
                        x: 340,
                        y: 1120 + ((shiftYBy - 120) * i) 
                    },
                    `B${i}`,
                    {fontSize: 30}
                );

                this.outputBitLabel[i] = this.view.addText(
                    {
                        x: 943 + 250,
                        y: 220 + (shiftYBy * i),
                    },
                    "",
                    {fontSize: 30}
                );

                this.outputLabel[i] = this.view.addText(
                    {
                        x: 943 + 250 + 60,
                        y: 250 + (shiftYBy * i),
                    },
                    `R${i}`,
                    {fontSize: 30}
                );
            }

            if (!this.hideConnAndSwitch) {
                this.outputConns[i] = this.view.addConnector(
                    {
                        x: 953 + 250,
                        y: 250 + (shiftYBy * i),
                    },
                );

                const inp1Switch = this.view.addSwitch(
                    {
                        x: 400,
                        y: 225 + ((shiftYBy - 120) * i)
                    },
                    12,
                    (bit) => {
                        this.inp1Bits[i] = bit;
                        this.update();
                    }
                );

                const inp2Switch = this.view.addSwitch(
                    {
                       x: 400,
                       y: 1115 + ((shiftYBy - 120) * i)
                    },
                    12,
                    (bit) => {
                        this.inp2Bits[i] = bit;
                        this.update();
                    }
                );

                this.view.setSwitchBit(inp1Switch.switchId, this.inp1Bits[i]);
                this.view.setSwitchBit(inp2Switch.switchId, this.inp2Bits[i]);
            }
        }
    }

    private update0() {
        const selectBit0 = this.selectBits[0];
        this.setSignal(selectBit0, [this.selectWire], []);
        if (this.selectBitLabel[0]) this.view.setTextBitAnimated(this.selectBitLabel[0].textId, selectBit0);

        const result = Array.from({length: this.inpLen}).fill(0) as Bit8;

        for (let pin = 0; pin < this.inpLen; pin++) {
            const inp1Bit = this.inp1Bits[pin];
            const inp2Bit = this.inp2Bits[pin];

            this.setSignal(inp1Bit, this.inp1Wires[pin], []);
            this.setSignal(inp2Bit, this.inp2Wires[pin], []);

            if (this.inp1BitLabels[pin]) this.view.setTextBitAnimated(this.inp1BitLabels[pin].textId, inp1Bit);
            if (this.inp2BitLabels[pin]) this.view.setTextBitAnimated(this.inp2BitLabels[pin].textId, inp2Bit);

            result[pin] = mux2To1(inp1Bit, inp2Bit, selectBit0);
            this.setSignal(result[pin], [this.outputWires[pin]], this.outputConns[pin] ? [this.outputConns[pin]] : []);
            if (this.outputBitLabel[pin]) this.view.setTextBitAnimated(this.outputBitLabel[pin].textId, result[pin]);
        }

        this.finalOut = result;
    }

    private update1() {
        const selectBit0 = this.selectBits[0];
        this.setSignal(selectBit0, [this.selectWire, ...this.selectWiresvh.flat()], this.selectConns);
        if (this.selectBitLabel[0]) this.view.setTextBitAnimated(this.selectBitLabel[0].textId, selectBit0);

        const result = Array.from({length: this.inpLen}).fill(0) as Bit8;

        for (let pin = 0; pin < this.inpLen; pin++) {
            const inp1Bit = this.inp1Bits[pin];
            const inp2Bit = this.inp2Bits[pin];

            this.setSignal(inp1Bit, this.inp1Wires[pin], []);
            this.setSignal(inp2Bit, this.inp2Wires[pin], []);

            if (this.inp1BitLabels[pin]) this.view.setTextBitAnimated(this.inp1BitLabels[pin].textId, inp1Bit);
            if (this.inp2BitLabels[pin]) this.view.setTextBitAnimated(this.inp2BitLabels[pin].textId, inp2Bit);

            result[pin] = this.mux2to1[pin].setInputs([inp1Bit, inp2Bit], this.selectBits);
            this.setSignal(result[pin], [this.outputWires[pin]], this.outputConns[pin] ? [this.outputConns[pin]] : []);
            if (this.outputBitLabel[pin]) this.view.setTextBitAnimated(this.outputBitLabel[pin].textId, result[pin]);
        }

        this.finalOut = result;
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
            const conn
            of connectors
        ) {

            this.view.setConnectorBit(
                conn.connectorId,
                bit,
            );
        }
    }

    setInputs(inpData: [d0: Bit8, d1: Bit8], inpSelect: [s0: Bit]): Bit8 {
        this.inp1Bits = inpData[0];
        this.inp2Bits = inpData[1];
        this.selectBits = inpSelect;
        this.update();
        return this.finalOut;
    }
}