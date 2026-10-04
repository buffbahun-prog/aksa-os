import { andGate, inverter } from "../../virtual-machine/C.P.U/gates";
import { DLatch, SRLatch } from "../../virtual-machine/C.P.U/memory";
import type { Bit} from "../../virtual-machine/types";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";

export class DLatchCircuit extends LevelledCircuit {
    private inpData: Bit = 0;
    private inpClk: Bit = 0;

    inpClkWires: WireResult[] = [];
    inpClkConns: ConnectorResult[] = [];

    inpDataWires: WireResult[] = [];
    inpDataConns: ConnectorResult[] = [];

    dataInvWires: WireResult[] = [];

    resetWires: WireResult[] = [];
    setWires: WireResult[] = [];

    qOutWires: WireResult[] = [];
    qOutConns: ConnectorResult[] = [];

    qInvOutWires: WireResult[] = [];
    qInvOutConns: ConnectorResult[] = [];

    inpClkBitLabel!: TextResult;
    inpDataBitLabel!: TextResult;

    outQBitLabel!: TextResult;
    outQInvBitLabel!: TextResult;

    private stateElm: SRLatch;

    private hideConnAndSwitch: boolean;

    private finalResult: [q: Bit, qInv: Bit] = [0, 1];

    constructor(hide = false) {
        super(1);

        this.hideConnAndSwitch = hide;

        this.stateElm = new SRLatch();

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
                x: 425,
                y: 400,
            },
            {
                width: 445,
                height: 280,
            }
        );

        this.view.addText(
            {
                x: 425,
                y: 400,
            },
            "D-Latch",
            {
                fontSize: 60
            }
        );

        this.view.addText(
            {
                x: 250,
                y: 300,
            },
            "CLK",
            {fontSize: 30}
        );

        this.view.addText(
            {
                x: 235,
                y: 500,
            },
            "D",
            {fontSize: 30}
        );

        this.view.addText(
            {
                x: 615,
                y: 345,
            },
            "Q",
            {fontSize: 30}
        );

        this.view.addText(
            {
                x: 615,
                y: 465,
            },
            "Q̅",
            {fontSize: 30}
        );

        if (!this.hideConnAndSwitch) {
            this.inpClkBitLabel = this.view.addText(
                {
                    x: 130,
                    y: 280,
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
                    x: 750,
                    y: 320,
                },
                "",
                {fontSize: 30}
            );

            this.outQInvBitLabel = this.view.addText(
                {
                    x: 750,
                    y: 440,
                },
                "",
                {fontSize: 30}
            );
        }

        this.inpClkWires = [
            this.view.addWire(
                {
                    x: 100,
                    y: 300,
                },
                100,
                "horz",
            ),
        ];

        this.inpClkConns = [];

        this.inpDataWires = [
            this.view.addWire(
                {
                    x: 100,
                    y: 500,
                },
                100,
                "horz",
            ),
        ];

        this.inpDataConns = [];

        this.qOutWires = [
            this.view.addWire(
                {
                    x: 650,
                    y: 340,
                },
                120,
                "horz",
            ),
        ];

        this.qOutConns = !this.hideConnAndSwitch ? [
            this.view.addConnector(
                {
                    x: 650 + 120,
                    y: 340,
                }
            ),
        ] : [];

        this.qInvOutWires = [
            this.view.addWire(
                {
                    x: 650,
                    y: 460,
                },
                120,
                "horz",
            ),
        ];

        this.qInvOutConns = !this.hideConnAndSwitch ? [
            this.view.addConnector(
                {
                    x: 650 + 120,
                    y: 460,
                }
            ),
        ] : [];

        if (!this.hideConnAndSwitch) {

            const switchInpClk = this.view.addSwitch(
            {
                x: 100,
                y: 300,
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

        this.inpClkWires = [
            this.view.addWire(
                {
                    x: 100,
                    y: 300,
                },
                300,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 150,
                    y: 300,
                },
                150,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 150,
                    y: 300 + 150,
                },
                250,
                "horz",
            ),
        ];

        this.inpClkConns = [
            this.view.addConnector(
                {
                    x: 150,
                    y: 300,
                },
            ),
        ];

        this.inpDataWires = [
            this.view.addWire(
                {
                    x: 100,
                    y: 500,
                },
                300,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 200,
                    y: 500,
                },
                -150,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 200,
                    y: 500 - 150,
                },
                50,
                "horz",
            ),
        ];

        this.inpDataConns = [
            this.view.addConnector(
                {
                    x: 200,
                    y: 500,
                },
            ),
        ];

        this.view.addNotGate(
            {
                x: 250,
                y: 500 - 150,
            },
            {
                width: 40,
                height: 40,
            }
        );

        this.dataInvWires = [
            this.view.addWire(
                {
                    x: 290,
                    y: 500 - 150,
                },
                110,
                "horz",
            ),
        ];

        this.view.addAndGate(
            {
                x: 440,
                y: 325,
            },
            {
                width: 80,
                height: 80,
            }
        );

        this.resetWires = [
            this.view.addWire(
                {
                    x: 480,
                    y: 325,
                },
                100,
                "horz",
            ),
        ];

        this.view.addNorGate(
            {
                x: 600,
                y: 340,
            },
            {
                width: 60,
                height: 60,
            }
        );

        this.qOutWires = [
            this.view.addWire(
                {
                    x: 650,
                    y: 340,
                },
                120,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 700,
                    y: 340,
                },
                70,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 700,
                    y: 340 + 70,
                },
                -150,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 700 - 150,
                    y: 340 + 70,
                },
                35,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 700 - 150,
                    y: 340 + 70 + 35,
                },
                30,
                "horz",
            ),
        ];

        this.qOutConns = [
            this.view.addConnector(
                {
                    x: 650 + 120,
                    y: 340,
                },
                !this.hideConnAndSwitch ? 6 : 0,
            ),
            this.view.addConnector(
                {
                    x: 700,
                    y: 340,
                }
            ),
        ];


        this.view.addAndGate(
            {
                x: 440,
                y: 475,
            },
            {
                width: 80,
                height: 80,
            }
        );

        this.setWires = [
            this.view.addWire(
                {
                    x: 480,
                    y: 475,
                },
                100,
                "horz",
            ),
        ];

        this.view.addNorGate(
            {
                x: 600,
                y: 460,
            },
            {
                width: 60,
                height: 60,
            }
        );

        this.qInvOutWires = [
            this.view.addWire(
                {
                    x: 650,
                    y: 460,
                },
                120,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 680,
                    y: 460,
                },
                -70,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 680,
                    y: 460 - 70,
                },
                -130,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 680 - 130,
                    y: 460 - 70,
                },
                -35,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 680 - 130,
                    y: 460 - 70 - 35,
                },
                30,
                "horz",
            ),
        ];

        this.qInvOutConns = [
            this.view.addConnector(
                {
                    x: 650 + 120,
                    y: 460,
                },
                !this.hideConnAndSwitch ? 6 : 0,
            ),
            this.view.addConnector(
                {
                    x: 680,
                    y: 460,
                }
            ),
        ];

        if (!this.hideConnAndSwitch) {
            this.view.addText(
                {
                    x: 40,
                    y: 300,
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
                    x: 800,
                    y: 345,
                },
                "Q",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 800,
                    y: 465,
                },
                "Q̅",
                {fontSize: 30}
            );

            this.inpClkBitLabel = this.view.addText(
                {
                    x: 130,
                    y: 280,
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
                    x: 750,
                    y: 320,
                },
                "",
                {fontSize: 30}
            );

            this.outQInvBitLabel = this.view.addText(
                {
                    x: 750,
                    y: 440,
                },
                "",
                {fontSize: 30}
            );
        }

        if (!this.hideConnAndSwitch) {

            const switchInpClk = this.view.addSwitch(
            {
                x: 100,
                y: 300,
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

        const q = DLatch(clk, data, this.stateElm);
        this.setSignal(
            q,
            this.qOutWires,
            this.qOutConns,
        );
        if (this.outQBitLabel) this.view.setTextBitAnimated(this.outQBitLabel.textId, q);

        const qInv = inverter(q);
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
        
        const dataInv = inverter(data);
        this.setSignal(
            dataInv,
            this.dataInvWires,
            [],
        );
        
        const setCtrl = andGate(clk, data);
        this.setSignal(
            setCtrl,
            this.setWires,
            [],
        );

        const resetCtrl = andGate(clk, dataInv);
        this.setSignal(
            resetCtrl,
            this.resetWires,
            [],
        );
        
        this.stateElm.setReset([setCtrl, resetCtrl]);

        const q = this.stateElm.get();
        this.setSignal(
            q,
            this.qOutWires,
            this.qOutConns,
        );
        if (this.outQBitLabel) this.view.setTextBitAnimated(this.outQBitLabel.textId, q);

        const qInv = inverter(q);
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