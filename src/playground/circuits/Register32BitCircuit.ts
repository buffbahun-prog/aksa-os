import type { Bit, Bit32} from "../../virtual-machine/types";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";
import { EnabledFlipFlopCircuit } from "./EnabledFlipFlop";

export class Register32BitCircuit extends LevelledCircuit {
    private readonly inpLen = 32;

    private inpData: Bit32 = Array.from({length: this.inpLen}).fill(0) as Bit32;
    private inpClk: Bit = 0;
    private inpEnbl: Bit = 0;

    inpClkWires: WireResult[] = [];
    inpClkConns: ConnectorResult[] = [];

    inpDataWires: WireResult[][] = Array.from({length: this.inpLen});

    inpEnblWires: WireResult[] = [];
    inpEnblConns: ConnectorResult[] = [];

    qOutWires: WireResult[][] = Array.from({length: this.inpLen});
    qOutConns: ConnectorResult[][] = Array.from({length: this.inpLen});

    inpClkBitLabel!: TextResult;
    inpDataBitLabels: TextResult[] = Array.from({length: this.inpLen});
    inpEnblBitLabel!: TextResult;

    outQBitLabels: TextResult[] = Array.from({length: this.inpLen});

    private stateElm: EnabledFlipFlopCircuit[] = Array.from({length: this.inpLen});

    private hideConnAndSwitch: boolean;

    private finalResult: Bit32 = this.inpData;

    constructor(hide = false) {
        super(4);

        this.hideConnAndSwitch = hide;

        for (let i = 0; i < this.inpLen; i++) {
            this.stateElm[i] = new EnabledFlipFlopCircuit(true);
            this.stateElm[i].getView.moveBy(100 + (i * 300), 250);
            this.stateElm[i].getView.resize(.3);
        }

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
            case 3:
            case 4:
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
            case 3:
            case 4:
                this.update1();
                break;
        }
        
    }

    private build0() {

        this.view.addBox(
            {
                x:4925,
                y: 387,
            },
            {
                width: 9630,
                height: 160,
            }
        );

        this.view.addText(
            {
                x: 4925,
                y: 387,
            },
            "Register 32 Bit",
            {fontSize: 50},
        );

        const stateElmShiftX = 300;
        for (let i = 0; i < this.inpLen; i++) {

            // this.view.addText(
            //     {
            //         x: 200 + (20 *i),
            //         y: 390,
            //     },
            //     `${this.inpData[i]}`,
            //     {fontSize: 30},
            // );

            this.inpDataWires[i] =  [
                this.view.addWire(
                    {
                        x: 130 + (i * stateElmShiftX),
                        y: 500,
                    },
                    -30,
                    "vert",
                ),
            ];

            this.qOutWires[i] = [
                this.view.addWire(
                    {
                        x: 400 + (i * stateElmShiftX),
                        y: 274,
                    },
                    30,
                    "vert",
                ),
            ];

            this.view.addText(
                {
                    x: 170 + (i * stateElmShiftX),
                    y: 450,
                },
                `D${i}`,
                {fontSize: 30},
            );

            this.view.addText(
                {
                    x: 400 + (i * stateElmShiftX),
                    y: 330,
                },
                `Q${i}`,
                {fontSize: 30},
            );

            if (!this.hideConnAndSwitch) {

                this.inpDataBitLabels[i] = this.view.addText(
                    {
                        x: 160 + (i * stateElmShiftX),
                        y: 490,
                    },
                    "",
                    {fontSize: 30},
                );

                this.outQBitLabels[i] = this.view.addText(
                    {
                        x: 420 + (i * stateElmShiftX),
                        y: 290,
                    },
                    "",
                    {fontSize: 30},
                );

                this.qOutConns[i] = [
                    this.view.addConnector(
                        {
                            x: 400 + (i * stateElmShiftX),
                            y: 274,
                        },
                    ),
                ];

                const switchInpData = this.view.addSwitch(
                    {
                        x: 130 + (i * stateElmShiftX),
                        y: 500,
                    },
                    12,
                    (bit) => {
                        this.inpData[i] = bit;
                        this.update();
                    }
                );

                this.view.setSwitchBit(switchInpData.switchId, this.inpData[i]);
            }

        }

        this.inpClkWires = [
            this.view.addWire(
                {
                    x: 50,
                    y: 325,
                },
                57,
                "horz",
            ),
        ];

        this.inpEnblWires = [
            this.view.addWire(
                {
                    x: 50,
                    y: 451,
                },
                57,
                "horz",
            ),
        ];

        this.inpClkConns = [];

        this.inpEnblConns = [];

        this.view.addText(
                {
                    x: 150,
                    y: 330,
                },
                "CLK",
                {fontSize: 30},
            );

        this.view.addText(
            {
                x: 140,
                y: 421,
            },
            "EN",
            {fontSize: 30},
        );

        if (!this.hideConnAndSwitch) {

            this.inpClkBitLabel = this.view.addText(
                {
                    x: 70,
                    y: 300,
                },
                "",
                {fontSize: 30},
            );

            this.inpEnblBitLabel = this.view.addText(
                {
                    x: 70,
                    y: 425,
                },
                "",
                {fontSize: 30},
            );

            const switchInpClk = this.view.addSwitch(
                {
                    x: 50,
                    y: 325,
                },
                12,
                (bit) => {

                    this.inpClk =
                        bit;

                    this.update();
                },
            );

            const switchInpEnbl = this.view.addSwitch(
                {
                    x: 50,
                    y: 451,
                },
                12,
                (bit) => {
                    this.inpEnbl = bit;
                    this.update();
                },
            );

            this.view.setSwitchBit(switchInpClk.switchId, this.inpClk);
            this.view.setSwitchBit(switchInpEnbl.switchId, this.inpEnbl);
        }
    }

    private build1() {
        const level = this.level;

        const stateElmShiftX = 300;
        const clkWires = [];
        const enblWires = [];
        const clkConns = [];
        const enblConns = [];
        for (let i = 0; i < this.inpLen; i++) {
            this.stateElm[i].setLevel(level - 1, false);
            this.view.element.appendChild(this.stateElm[i].element);

            clkWires.push(
                this.view.addWire(
                    {
                        x: 300.5 + (i * stateElmShiftX),
                        y: 325,
                    },
                    21.7,
                    "vert",
                ),
            );

            if (i < this.inpLen - 1)
                clkConns.push(this.view.addConnector(
                    {
                        x: 300.5 + (i * stateElmShiftX),
                        y: 325,
                    }
                ));

            enblWires.push(
                this.view.addWire(
                    {
                        x: 220 + (i * stateElmShiftX),
                        y: 451,
                    },
                    -21.7,
                    "vert",
                ),
            );

            if (i < this.inpLen - 1)
                enblConns.push(this.view.addConnector(
                    {
                        x: 220 + (i * stateElmShiftX),
                        y: 451,
                    }
                ));

            this.inpDataWires[i] =  [
                this.view.addWire(
                    {
                        x: 130 + (i * stateElmShiftX),
                        y: 500,
                    },
                    -100,
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 130 + (i * stateElmShiftX),
                        y: 500 - 100,
                    },
                    25,
                    "horz",
                ),
            ];

            this.qOutWires[i] = [
                this.view.addWire(
                    {
                        x: 400 + (i * stateElmShiftX),
                        y: 274,
                    },
                    100,
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 400 + (i * stateElmShiftX),
                        y: 274 + 100,
                    },
                    -21,
                    "horz",
                ),
            ];

            if (!this.hideConnAndSwitch) {

                this.inpDataBitLabels[i] = this.view.addText(
                    {
                        x: 160 + (i * stateElmShiftX),
                        y: 490,
                    },
                    "",
                    {fontSize: 30},
                );

                this.outQBitLabels[i] = this.view.addText(
                    {
                        x: 420 + (i * stateElmShiftX),
                        y: 290,
                    },
                    "",
                    {fontSize: 30},
                );

                this.view.addText(
                    {
                        x: 130 + (i * stateElmShiftX),
                        y: 550,
                    },
                    `D${i}`,
                    {fontSize: 30},
                );

                this.view.addText(
                    {
                        x: 400 + (i * stateElmShiftX),
                        y: 240,
                    },
                    `Q${i}`,
                    {fontSize: 30},
                );

                this.qOutConns[i] = [
                    this.view.addConnector(
                        {
                            x: 400 + (i * stateElmShiftX),
                            y: 274,
                        },
                    ),
                ];

                const switchInpData = this.view.addSwitch(
                    {
                        x: 130 + (i * stateElmShiftX),
                        y: 500,
                    },
                    12,
                    (bit) => {
                        this.inpData[i] = bit;
                        this.update();
                    }
                );

                this.view.setSwitchBit(switchInpData.switchId, this.inpData[i]);
            }

        }

        clkWires.push(
            this.view.addWire(
                {
                    x: 50,
                    y: 325,
                },
                9550,
                "horz",
            ),
        );

        enblWires.push(
            this.view.addWire(
                {
                    x: 50,
                    y: 451,
                },
                9470,
                "horz",
            ),
        );

        this.inpClkWires = clkWires;
        this.inpClkConns = clkConns;

        this.inpEnblWires = enblWires;
        this.inpEnblConns = enblConns;

        if (!this.hideConnAndSwitch) {

            this.inpClkBitLabel = this.view.addText(
                {
                    x: 70,
                    y: 300,
                },
                "",
                {fontSize: 30},
            );

            this.inpEnblBitLabel = this.view.addText(
                {
                    x: 70,
                    y: 425,
                },
                "",
                {fontSize: 30},
            );

            this.view.addText(
                {
                    x: -10,
                    y: 325,
                },
                "CLK",
                {fontSize: 30},
            );

            this.view.addText(
                {
                    x: 0,
                    y: 451,
                },
                "EN",
                {fontSize: 30},
            );

            const switchInpClk = this.view.addSwitch(
                {
                    x: 50,
                    y: 325,
                },
                12,
                (bit) => {

                    this.inpClk =
                        bit;

                    this.update();
                },
            );

            const switchInpEnbl = this.view.addSwitch(
                {
                    x: 50,
                    y: 451,
                },
                12,
                (bit) => {
                    this.inpEnbl = bit;
                    this.update();
                },
            );

            this.view.setSwitchBit(switchInpClk.switchId, this.inpClk);
            this.view.setSwitchBit(switchInpEnbl.switchId, this.inpEnbl);
        }
    }

    private update0() {
        const clk = this.inpClk;
        this.setSignal(
            clk,
            this.inpClkWires,
            this.inpClkConns,
        );

        if (this.inpClkBitLabel) this.view.setTextBitAnimated(this.inpClkBitLabel.textId, clk);

        const enable = this.inpEnbl;
        this.setSignal(
            enable,
            this.inpEnblWires,
            this.inpEnblConns,
        );

        if (this.inpEnblBitLabel) this.view.setTextBitAnimated(this.inpEnblBitLabel.textId, enable);

        for (let i = 0; i < this.inpLen; i++) {
            const data = this.inpData[i];
            this.setSignal(
                data,
                this.inpDataWires[i],
                [],
            );

            if (this.inpDataBitLabels[i]) this.view.setTextBitAnimated(this.inpDataBitLabels[i].textId, data);

            const [q, _] = this.stateElm[i].setInputs(clk, enable, data);
            this.setSignal(
                q,
                this.qOutWires[i],
                this.qOutConns[i],
            );

            if (this.outQBitLabels[i]) this.view.setTextBitAnimated(this.outQBitLabels[i].textId, q);
        }

        this.finalResult = this.stateElm.map(elm => elm.getQ()) as Bit32;  
    }

    private update1() {
        const clk = this.inpClk;
        this.setSignal(
            clk,
            this.inpClkWires,
            this.inpClkConns,
        );

        if (this.inpClkBitLabel) this.view.setTextBitAnimated(this.inpClkBitLabel.textId, clk);

        const enable = this.inpEnbl;
        this.setSignal(
            enable,
            this.inpEnblWires,
            this.inpEnblConns,
        );

        if (this.inpEnblBitLabel) this.view.setTextBitAnimated(this.inpEnblBitLabel.textId, enable);

        for (let i = 0; i < this.inpLen; i++) {
            const data = this.inpData[i];
            this.setSignal(
                data,
                this.inpDataWires[i],
                [],
            );

            if (this.inpDataBitLabels[i]) this.view.setTextBitAnimated(this.inpDataBitLabels[i].textId, data);

            const [q, _] = this.stateElm[i].setInputs(clk, enable, data);
            this.setSignal(
                q,
                this.qOutWires[i],
                this.qOutConns[i],
            );

            if (this.outQBitLabels[i]) this.view.setTextBitAnimated(this.outQBitLabels[i].textId, q);
        }

        this.finalResult = this.stateElm.map(elm => elm.getQ()) as Bit32;  
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

    setInputs(clk: Bit, enable: Bit, data: Bit32): Bit32 {
        this.inpClk = clk;
        this.inpEnbl = enable;
        this.inpData = data;
        this.update();
        return this.finalResult;
    }

    getQ() {
        return this.finalResult;
    }
}