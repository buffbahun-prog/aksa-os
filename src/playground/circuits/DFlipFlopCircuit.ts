import { inverter } from "../../virtual-machine/C.P.U/gates";
import type { Bit} from "../../virtual-machine/types";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";
import { DLatchCircuit } from "./DLatchCircuit";

export class DFlipFlopCircuit extends LevelledCircuit {
    private inpData: Bit = 0;
    private inpClk: Bit = 0;

    inpClkWires: WireResult[] = [];
    inpClkConns: ConnectorResult[] = [];

    inpDataWires: WireResult[] = [];
    inpDataConns: ConnectorResult[] = [];

    clkInvWires: WireResult[] = [];

    leadrQOutWires: WireResult[] = [];

    qOutWires: WireResult[] = [];
    qOutConns: ConnectorResult[] = [];

    qInvOutWires: WireResult[] = [];
    qInvOutConns: ConnectorResult[] = [];

    inpClkBitLabel!: TextResult;
    inpDataBitLabel!: TextResult;

    outQBitLabel!: TextResult;
    outQInvBitLabel!: TextResult;

    private leaderStateElm: DLatchCircuit;
    private followerStateElm: DLatchCircuit;

    private hideConnAndSwitch: boolean;

    private finalResult: [q: Bit, qInv: Bit] = [0, 1];

    constructor(hide = false) {
        super(2);

        this.hideConnAndSwitch = hide;

        this.leaderStateElm = new DLatchCircuit(true);
        this.leaderStateElm.getView.moveBy(71, 200);
        this.leaderStateElm.getView.resize(.6);
        this.followerStateElm = new DLatchCircuit(true);
        this.followerStateElm.getView.moveBy(500, 200);
        this.followerStateElm.getView.resize(.6);

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
                x: 540,
                y: 427,
            },
            {
                width: 695,
                height: 250,
            }
        );

        this.view.addText(
            {
                x: 560,
                y: 312.5,
            },
            "▼",
            {fontSize: 20},
        );

        this.view.addText(
            {
                x: 540,
                y: 427,
            },
            "D Flip-Flop",
            {fontSize: 80}
        );

        this.inpClkWires = [
            this.view.addWire(
                {
                    x: 560,
                    y: 250,
                },
                50,
                "vert",
            ),
        ];

        this.inpClkConns = [
        ];

        this.inpDataWires = [
            this.view.addWire(
                {
                    x: 100,
                    y: 500,
                },
                90,
                "horz",
            ),
        ];

        this.inpDataConns = [
        ];

        this.qOutWires = [
            this.view.addWire(
                {
                    x: 890,
                    y: 404,
                },
                120,
                "horz",
            ),
        ];

        this.qOutConns = [
            this.view.addConnector(
                {
                    x: 890 + 120,
                    y: 404,
                },
                !this.hideConnAndSwitch ? 6 : 0,
            ),
        ];

        this.qInvOutWires = [
            this.view.addWire(
                {
                    x: 890,
                    y: 476,
                },
                120,
                "horz",
            ),
        ];

        this.qInvOutConns = [
            this.view.addConnector(
                {
                    x: 890 + 120,
                    y: 476,
                },
                !this.hideConnAndSwitch ? 6 : 0,
            ),
        ];

        this.view.addText(
            {
                x: 560,
                y: 345,
            },
            "CLK",
            {fontSize: 30}
        );
        this.view.addText(
            {
                x: 220,
                y: 500,
            },
            "D",
            {fontSize: 30}
        );
        this.view.addText(
            {
                x: 860,
                y: 404,
            },
            "Q",
            {fontSize: 30}
        );
        this.view.addText(
            {
                x: 860,
                y: 476,
            },
            "Q̅",
            {fontSize: 30}
        );

        if (!this.hideConnAndSwitch) {
            this.inpClkBitLabel = this.view.addText(
                {
                    x: 590,
                    y: 260,
                },
                "",
                {fontSize: 30}
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
                    y: 380,
                },
                "",
                {fontSize: 30}
            );

            this.outQInvBitLabel = this.view.addText(
                {
                    x: 1000,
                    y: 450,
                },
                "",
                {fontSize: 30}
            );
        }

        if (!this.hideConnAndSwitch) {

            const switchInpClk = this.view.addSwitch(
            {
                x: 560,
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

        this.view.setSwitchBit(switchInpClk.switchId, this.inpClk);
        this.view.setSwitchBit(switchInpData.switchId, this.inpData);
        }
    }

    private build1() {
        const level = this.level;
        // const level = 2;

        this.leaderStateElm.setLevel(level - 1, false);
        this.view.element.appendChild(this.leaderStateElm.element);

        this.followerStateElm.setLevel(level - 1, false);
        this.view.element.appendChild(this.followerStateElm.element);


        this.inpClkWires = [
            this.view.addWire(
                {
                    x: 560,
                    y: 250,
                },
                130,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 560,
                    y: 250 + 130,
                },
                60,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 560,
                    y: 320,
                },
                -100,
                "horz",
            ),
        ];

        this.inpClkConns = [
            this.view.addConnector(
                {
                    x: 560,
                    y: 320,
                },
            ),
        ];

        this.inpDataWires = [
            this.view.addWire(
                {
                    x: 100,
                    y: 500,
                },
                90,
                "horz",
            ),
        ];

        this.inpDataConns = [
        ];

        this.view.addNotGate(
            {
                x: 437,
                y: 320,
            },
            {
                width: 40,
                height: 40,
            },
            true,
            "left"
        );

        this.clkInvWires = [
            this.view.addWire(
                {
                    x: 395,
                    y: 320,
                },
                -265,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 395 - 265,
                    y: 320,
                },
                60,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 395 - 265,
                    y: 320 + 60,
                },
                60,
                "horz",
            ),
        ];

        this.leadrQOutWires = [
            this.view.addWire(
                {
                    x: 461,
                    y: 404,
                },
                90,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 461 + 90,
                    y: 404,
                },
                96,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 461 + 90,
                    y: 404 + 96,
                },
                69,
                "horz",
            ),
        ];

        this.qOutWires = [
            this.view.addWire(
                {
                    x: 890,
                    y: 404,
                },
                120,
                "horz",
            ),
        ];

        this.qOutConns = [
            this.view.addConnector(
                {
                    x: 890 + 120,
                    y: 404,
                },
                !this.hideConnAndSwitch ? 6 : 0,
            ),
        ];

        this.qInvOutWires = [
            this.view.addWire(
                {
                    x: 890,
                    y: 476,
                },
                120,
                "horz",
            ),
        ];

        this.qInvOutConns = [
            this.view.addConnector(
                {
                    x: 890 + 120,
                    y: 476,
                },
                !this.hideConnAndSwitch ? 6 : 0,
            ),
        ];

        if (!this.hideConnAndSwitch) {
            this.view.addText(
                {
                    x: 560,
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
                    x: 1050,
                    y: 404,
                },
                "Q",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 1050,
                    y: 476,
                },
                "Q̅",
                {fontSize: 30}
            );

            this.inpClkBitLabel = this.view.addText(
                {
                    x: 590,
                    y: 260,
                },
                "",
                {fontSize: 30}
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
                    y: 380,
                },
                "",
                {fontSize: 30}
            );

            this.outQInvBitLabel = this.view.addText(
                {
                    x: 1000,
                    y: 450,
                },
                "",
                {fontSize: 30}
            );
        }

        if (!this.hideConnAndSwitch) {

            const switchInpClk = this.view.addSwitch(
            {
                x: 560,
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

        this.view.setSwitchBit(switchInpClk.switchId, this.inpClk);
        this.view.setSwitchBit(switchInpData.switchId, this.inpData);
        }
    }

    private update0() {
        const data = this.inpData;
        this.setSignal(
            data,
            this.inpDataWires,
            this.inpDataConns,
        );
        if (this.inpDataBitLabel) this.view.setTextBitAnimated(this.inpDataBitLabel.textId, data);

        const clk = this.inpClk;
        this.setSignal(
            clk,
            this.inpClkWires,
            this.inpClkConns,
        );
        if (this.inpClkBitLabel) this.view.setTextBitAnimated(this.inpClkBitLabel.textId, clk);
        
        const clkInv = inverter(clk);

        // leader latch
        const [leaderOutputBit, _] = this.leaderStateElm.setInputs(clkInv, data);

        // follower latch
        const [q, qInv] = this.followerStateElm.setInputs(clk, leaderOutputBit);
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
            this.inpDataConns,
        );
        if (this.inpDataBitLabel) this.view.setTextBitAnimated(this.inpDataBitLabel.textId, data);

        const clk = this.inpClk;
        this.setSignal(
            clk,
            this.inpClkWires,
            this.inpClkConns,
        );
        if (this.inpClkBitLabel) this.view.setTextBitAnimated(this.inpClkBitLabel.textId, clk);
        
        const clkInv = inverter(clk);
        this.setSignal(
            clkInv,
            this.clkInvWires,
            [],
        );

        // leader latch
        const [leaderOutputBit, _] = this.leaderStateElm.setInputs(clkInv, data);
        this.setSignal(
            leaderOutputBit,
            this.leadrQOutWires,
            [],
        );

        // follower latch
        const [q, qInv] = this.followerStateElm.setInputs(clk, leaderOutputBit);
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

    setInputs(clk: Bit, data: Bit): [q: Bit, qInv: Bit] {
        this.inpClk = clk;
        this.inpData = data;
        this.update();
        return this.finalResult;
    }
}