import { mux2To1 } from "../../virtual-machine/C.P.U/mux_demux";
import type { Bit} from "../../virtual-machine/types";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";
import { DFlipFlopCircuit } from "./DFlipFlopCircuit";
import { Selector2to1Circuit } from "./Selector2to1";

export class EnabledFlipFlopCircuit extends LevelledCircuit {
    private inpData: Bit = 0;
    private inpClk: Bit = 0;
    private inpEnbl: Bit = 0;

    inpClkWires: WireResult[] = [];

    inpDataWires: WireResult[] = [];

    inpEnblWires: WireResult[] = [];

    // muxOutWires: WireResult[] = [];

    qOutWires: WireResult[] = [];
    qOutConns: ConnectorResult[] = [];

    qInvOutWires: WireResult[] = [];
    qInvOutConns: ConnectorResult[] = [];

    inpClkBitLabel!: TextResult;
    inpDataBitLabel!: TextResult;
    inpEnblBitLabel!: TextResult;

    outQBitLabel!: TextResult;
    outQInvBitLabel!: TextResult;

    private stateElm: DFlipFlopCircuit;
    private mux: Selector2to1Circuit;

    private hideConnAndSwitch: boolean;

    private finalResult: [q: Bit, qInv: Bit] = [0, 1];

    constructor(hide = false) {
        super(3);

        this.hideConnAndSwitch = hide;

        this.stateElm = new DFlipFlopCircuit(true);
        this.stateElm.getView.moveBy(333, 170);
        this.stateElm.getView.resize(.6);

        this.mux = new Selector2to1Circuit(true);
        this.mux.getView.moveBy(-40, 290);
        this.mux.getView.resize(.6);

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
                this.update1();
                break;
        }
        
    }

    private build0() {

        this.view.addBox(
            {
                x: 555,
                y: 460,
            },
            {
                width: 735,
                height: 260,
            }
        );

        this.view.addText(
            {
                x: 669,
                y: 341,
            },
            "▼",
            {fontSize: 20},
        );

        this.view.addText(
            {
                x: 555,
                y: 460,
            },
            "Enabled Flip-Flop",
            {fontSize: 70}
        );

        this.inpClkWires = [
            this.view.addWire(
                {
                    x: 669,
                    y: 250,
                },
                77,
                "vert",
            ),
        ];

        this.inpDataWires = [
            this.view.addWire(
                {
                    x: 100,
                    y: 500,
                },
                85,
                "horz",
            ),
        ];

        this.inpEnblWires = [
            this.view.addWire(
                {
                    x: 400,
                    y: 650,
                },
                -56,
                "vert",
            ),
        ];

        this.qOutWires = [
            this.view.addWire(
                {
                    x: 925,
                    y: 412.5,
                },
                80,
                "horz",
            ),
        ];

        this.qOutConns = [
            this.view.addConnector(
                {
                    x: 890 + 120,
                    y: 412.5,
                },
                !this.hideConnAndSwitch ? 6 : 0,
            ),
        ];

        this.qInvOutWires = [
            this.view.addWire(
                {
                    x: 925,
                    y: 455.5,
                },
                80,
                "horz",
            ),
        ];

        this.qInvOutConns = [
            this.view.addConnector(
                {
                    x: 890 + 120,
                    y: 455.5,
                },
                !this.hideConnAndSwitch ? 6 : 0,
            ),
        ];

        this.view.addText(
            {
                x: 669,
                y: 370,
            },
            "CLK",
            {fontSize: 30}
        );

        this.view.addText(
            {
                x: 210,
                y: 500,
            },
            "D",
            {fontSize: 30}
        );

        this.view.addText(
            {
                x: 400,
                y: 565,
            },
            "EN",
            {fontSize: 30}
        );

        this.view.addText(
            {
                x: 890,
                y: 412,
            },
            "Q",
            {fontSize: 30}
        );

        this.view.addText(
            {
                x: 890,
                y: 457,
            },
            "Q̅",
            {fontSize: 30}
        );

        if (!this.hideConnAndSwitch) {
            this.inpClkBitLabel = this.view.addText(
                {
                    x: 699,
                    y: 260,
                },
                "",
                {fontSize: 30}
            );

            this.inpEnblBitLabel = this.view.addText(
                {
                    x: 430,
                    y: 640,
                },
                "",
                {fontSize: 30},
            );

            this.inpDataBitLabel = this.view.addText(
                {
                    x: 130,
                    y: 480,
                },
                "",
                {fontSize: 30}
            );

            this.outQBitLabel = this.view.addText(
                {
                    x: 1000,
                    y: 390,
                },
                "",
                {fontSize: 30}
            );

            this.outQInvBitLabel = this.view.addText(
                {
                    x: 1000,
                    y: 483,
                },
                "",
                {fontSize: 30}
            );
        }

        if (!this.hideConnAndSwitch) {

            const switchInpClk = this.view.addSwitch(
            {
                x: 669,
                y: 250,
            },
            12,
            (bit) => {

                this.inpClk =
                    bit;

                this.update();
            },
        );

        const switchInpData = this.view.addSwitch(
            {
                x: 100,
                y: 500,
            },
            12,
            (bit) => {

                this.inpData =
                    bit;

                this.update();
            },
        );

        const switchInpEnbl = this.view.addSwitch(
            {
                x: 400,
                y: 650,
            },
            12,
            (bit) => {
                this.inpEnbl = bit;
                this.update();
            },
        );

        this.view.setSwitchBit(switchInpClk.switchId, this.inpClk);
        this.view.setSwitchBit(switchInpData.switchId, this.inpData);
        this.view.setSwitchBit(switchInpEnbl.switchId, this.inpEnbl);
        }
    }

    private build1() {
        const level = this.level;

        this.stateElm.setLevel(level - 1, false);
        this.view.element.appendChild(this.stateElm.element);

        this.mux.setLevel(level - 1, false);
        this.view.element.appendChild(this.mux.element);


        this.inpClkWires = [
            this.view.addWire(
                {
                    x: 669,
                    y: 250,
                },
                98,
                "vert",
            ),
        ];

        this.inpDataWires = [
            this.view.addWire(
                {
                    x: 100,
                    y: 500,
                },
                157,
                "horz",
            ),
        ];

        this.inpEnblWires = [
            this.view.addWire(
                {
                    x: 400,
                    y: 650,
                },
                -312,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 400,
                    y: 650 - 312,
                },
                -80,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 400 - 80,
                    y: 650 - 312,
                },
                40,
                "vert",
            ),
        ];

        this.qOutWires = [
            this.view.addWire(
                {
                    x: 868,
                    y: 412.5,
                },
                139,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 910,
                    y: 412.5,
                },
                170,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 910,
                    y: 412.5 + 170,
                },
                -715,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 910 - 715,
                    y: 412.5 + 170,
                },
                -143,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 910 - 715,
                    y: 412.5 + 170 - 143,
                },
                62,
                "horz",
            ),
        ];

        this.qOutConns = [
            this.view.addConnector(
                {
                    x: 890 + 120,
                    y: 412.5,
                },
                !this.hideConnAndSwitch ? 6 : 0,
            ),
            this.view.addConnector(
                {
                    x: 890 + 20,
                    y: 412.5,
                },
            ),
        ];

        this.qInvOutWires = [
            this.view.addWire(
                {
                    x: 868,
                    y: 455.5,
                },
                139,
                "horz",
            ),
        ];

        this.qInvOutConns = [
            this.view.addConnector(
                {
                    x: 890 + 120,
                    y: 455.5,
                },
                !this.hideConnAndSwitch ? 6 : 0,
            ),
        ];

        if (!this.hideConnAndSwitch) {
            this.view.addText(
                {
                    x: 669,
                    y: 210,
                },
                "CLK",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 60,
                    y: 500,
                },
                "D",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 400,
                    y: 695,
                },
                "EN",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 1050,
                    y: 412,
                },
                "Q",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 1050,
                    y: 457,
                },
                "Q̅",
                {fontSize: 30}
            );

            this.inpClkBitLabel = this.view.addText(
                {
                    x: 699,
                    y: 260,
                },
                "",
                {fontSize: 30}
            );

            this.inpEnblBitLabel = this.view.addText(
                {
                    x: 430,
                    y: 640,
                },
                "",
                {fontSize: 30},
            );

            this.inpDataBitLabel = this.view.addText(
                {
                    x: 130,
                    y: 480,
                },
                "",
                {fontSize: 30}
            );

            this.outQBitLabel = this.view.addText(
                {
                    x: 1000,
                    y: 390,
                },
                "",
                {fontSize: 30}
            );

            this.outQInvBitLabel = this.view.addText(
                {
                    x: 1000,
                    y: 483,
                },
                "",
                {fontSize: 30}
            );
        }

        if (!this.hideConnAndSwitch) {

            const switchInpClk = this.view.addSwitch(
            {
                x: 669,
                y: 250,
            },
            12,
            (bit) => {

                this.inpClk =
                    bit;

                this.update();
            },
        );

        const switchInpData = this.view.addSwitch(
            {
                x: 100,
                y: 500,
            },
            12,
            (bit) => {

                this.inpData =
                    bit;

                this.update();
            },
        );

        const switchInpEnbl = this.view.addSwitch(
            {
                x: 400,
                y: 650,
            },
            12,
            (bit) => {
                this.inpEnbl = bit;
                this.update();
            },
        );

        this.view.setSwitchBit(switchInpClk.switchId, this.inpClk);
        this.view.setSwitchBit(switchInpData.switchId, this.inpData);
        this.view.setSwitchBit(switchInpEnbl.switchId, this.inpEnbl);
        }
    }

    private update0() {
        const data = this.inpData;
        this.setSignal(
            data,
            this.inpDataWires,
            [],
        );
        if (this.inpDataBitLabel) this.view.setTextBitAnimated(this.inpDataBitLabel.textId, data);

        const clk = this.inpClk;
        this.setSignal(
            clk,
            this.inpClkWires,
            [],
        );
        if (this.inpClkBitLabel) this.view.setTextBitAnimated(this.inpClkBitLabel.textId, clk);

        const enabled = this.inpEnbl;
        this.setSignal(
            enabled,
            this.inpEnblWires,
            [],
        );

        if (this.inpEnblBitLabel) this.view.setTextBitAnimated(this.inpEnblBitLabel.textId, enabled);

        const prevData = this.stateElm.getQ();
        const newSetData = mux2To1(prevData, data, enabled);
        const [q, qInv] = this.stateElm.setInputs(clk, newSetData);

         this.setSignal(
            q,
            this.qOutWires,
            this.qOutConns,
        );
        if (this.outQBitLabel) this.view.setTextBitAnimated(this.outQBitLabel.textId, q);

        this.setSignal(
            qInv,
            this.qInvOutWires,
            this.qInvOutConns,
        );
        if (this.outQInvBitLabel) this.view.setTextBitAnimated(this.outQInvBitLabel.textId, qInv);

        this.finalResult = [q, qInv];
    }

    private update1() {
        const data = this.inpData;
        this.setSignal(
            data,
            this.inpDataWires,
            [],
        );
        if (this.inpDataBitLabel) this.view.setTextBitAnimated(this.inpDataBitLabel.textId, data);

        const clk = this.inpClk;
        this.setSignal(
            clk,
            this.inpClkWires,
            [],
        );
        if (this.inpClkBitLabel) this.view.setTextBitAnimated(this.inpClkBitLabel.textId, clk);

        const enabled = this.inpEnbl;
        this.setSignal(
            enabled,
            this.inpEnblWires,
            [],
        );

        if (this.inpEnblBitLabel) this.view.setTextBitAnimated(this.inpEnblBitLabel.textId, enabled);

        const prevData = this.stateElm.getQ();
        const newSetData = this.mux.setInputs([prevData, data], [enabled]);
        const [q, qInv] = this.stateElm.setInputs(clk, newSetData);

         this.setSignal(
            q,
            this.qOutWires,
            this.qOutConns,
        );
        if (this.outQBitLabel) this.view.setTextBitAnimated(this.outQBitLabel.textId, q);

        this.setSignal(
            qInv,
            this.qInvOutWires,
            this.qInvOutConns,
        );
        if (this.outQInvBitLabel) this.view.setTextBitAnimated(this.outQInvBitLabel.textId, qInv);

        this.finalResult = [q, qInv];
        
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

    setInputs(clk: Bit, enable: Bit, data: Bit): [q: Bit, qInv: Bit] {
        this.inpClk = clk;
        this.inpEnbl = enable;
        this.inpData = data;
        this.update();
        return this.finalResult;
    }

    getQ() {
        return this.finalResult[0];
    }
}