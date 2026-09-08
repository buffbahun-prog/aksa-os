import { aluBit1 } from "../../virtual-machine/C.P.U/ALU";
import { andGate, orGate, xorGate } from "../../virtual-machine/C.P.U/gates";
import type { Bit } from "../../virtual-machine/types";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";
import { FullAdderCircuit } from "./FullAdder";
import { Selector4to1Circuit } from "./Selector4to1";

export class ALU1BitCircuit extends LevelledCircuit {

    private inpBit1: Bit = 0;
    private inpBit2: Bit = 0;

    private aInvertBit: Bit = 0;
    private bInvertBit: Bit = 0;

    private carryInBit: Bit = 0;

    private opBit0: Bit = 0;
    private opBit1: Bit = 0;

    // =========================================================
    // INPUT 1
    // =========================================================

    private inpWire1!: WireResult;
    private inpWire1Label!: TextResult;

    // =========================================================
    // INPUT 2
    // =========================================================

    private inpWire2!: WireResult;
    private inpWire2Label!: TextResult;

    // =========================================================
    // CARRY IN
    // =========================================================

    private carryInWire!: WireResult;
    private carryInWireh!: WireResult;
    private carryInLabel!: TextResult;

    // =========================================================
    // OPERATION BITS
    // =========================================================

    private op0Wire!: WireResult;
    private op1Wire!: WireResult;
    private op0Label!: TextResult;
    private op1Label!: TextResult;

    // =========================================================
    // A Invert
    // =========================================================

    private aInvertWire!: WireResult;
    private aInvertWireh!: WireResult;
    private aInvertLabel!: TextResult;

    private andInpAWire!: WireResult;
    private orInpAWire!: WireResult;
    private orInpAConn!: ConnectorResult;
    private xorInpAWire!: WireResult;
    private xorInpAConn!: ConnectorResult;
    private adderInpAConn!: ConnectorResult;
    private adderInpAWire!: WireResult;
    private adderInpAWireh!: WireResult;

    // =========================================================
    // B Invert
    // =========================================================

    private bInvertWire!: WireResult;
    private bInvertWireh!: WireResult;
    private bInvertLabel!: TextResult;

    private andInpBWire!: WireResult;
    private orInpBWire!: WireResult;
    private orInpBConn!: ConnectorResult;
    private xorInpBWire!: WireResult;
    private xorInpBConn!: ConnectorResult;
    private adderInpBConn!: ConnectorResult;
    private adderInpBWire!: WireResult;
    private adderInpBWireh!: WireResult;

    // =========================================================
    // AND
    // =========================================================

    private andOutWire!: WireResult;

    // =========================================================
    // OR
    // =========================================================

    private orOutWire!: WireResult;
    private orOutWirev!: WireResult;
    private orOutWirevh!: WireResult;

    // =========================================================
    // XOR
    // =========================================================

    private xorOutWire!: WireResult;
    private xorOutWirev!: WireResult;
    private xorOutWirevh!: WireResult;

    // =========================================================
    // FULL ADDER
    // =========================================================

    private fullAdder!: FullAdderCircuit;
    private sumOutWire!: WireResult;
    private sumOutWirev!: WireResult;
    private sumOutWirevh!: WireResult;
    private carryOutWire!: WireResult;
    private carryOutWireh!: WireResult;
    private carryOutConn!: ConnectorResult;

    private carryOutLabel!: TextResult;

    // =========================================================
    // 4 to 1 MUX
    // =========================================================

    private mux!: Selector4to1Circuit;

    private muxOutWire!: WireResult;
    private muxOutConn!: ConnectorResult;
    private muxOutLabel!: TextResult;

    private hideConnAndSwitch: boolean;

    constructor(hide = false) {
        super(1);

        this.build();

        this.update();

        this.hideConnAndSwitch = hide;
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
        if (!this.hideConnAndSwitch) {
            this.inpWire1Label = this.view.addText(
                {
                    x: 100,
                    y: 225,
                },
                "",
                {fontSize: 30}
            );

            this.inpWire2Label = this.view.addText(
                {
                    x: 100,
                    y: 305,
                },
                "",
                {fontSize: 30}
            );

            this.aInvertLabel = this.view.addText(
                {
                    x: 200,
                    y: 180,
                },
                "",
                {fontSize: 30}
            );

            this.bInvertLabel = this.view.addText(
                {
                    x: 250,
                    y: 180,
                },
                "",
                {fontSize: 30}
            );

            this.carryOutLabel = this.view.addText(
                {
                    x: 690,
                    y: 140,
                },
                "",
                {fontSize: 30}
            );

            this.op0Label = this.view.addText(
                {
                    x: 795,
                    y: 180,
                },
                "",
                {fontSize: 30}
            );

            this.op1Label = this.view.addText(
                {
                    x: 845,
                    y: 180,
                },
                "",
                {fontSize: 30}
            );

            this.muxOutLabel = this.view.addText(
                {
                    x: 1022,
                    y: 360,
                },
                "",
                {fontSize: 30}
            );

            this.carryInLabel = this.view.addText(
                {
                    x: 465,
                    y: 755,
                },
                "",
                {fontSize: 30}
            );
        }
       this.inpWire1 = this.view.addWire(
        {
            x: 100,
            y: 265,
        },
        182,
        "horz",
       );

       this.aInvertWire = this.view.addWire(
        {
            x: 180,
            y: 150,
        },
        85,
        "vert",
       );

       this.inpWire2 = this.view.addWire(
        {
            x: 100,
            y: 345,
        },
        182,
        "horz",
       );

       this.bInvertWire = this.view.addWire(
        {
            x: 230,
            y: 150,
        },
        165,
        "vert",
       );

       this.carryInWire = this.view.addWire(
        {
            x: 435,
            y: 770,
        },
        -145,
        "vert",
       );

       this.carryOutWire = this.view.addWire(
        {
            x: 660,
            y: 150,
        },
        540,
        "vert",
       );

       if (!this.hideConnAndSwitch)
       this.carryOutConn = this.view.addConnector(
        {
            x: 660,
            y: 150,
        },
       );

       this.op0Wire = this.view.addWire(
        {
            x: 775,
            y: 150,
        },
        90,
        "vert",
       );

       this.op1Wire = this.view.addWire(
        {
            x: 825,
            y: 150,
        },
        90,
        "vert",
       );

       this.muxOutWire = this.view.addWire(
        {
            x: 952,
            y: 390,
        },
        70,
        "horz",
       );

       if (!this.hideConnAndSwitch)
       this.muxOutConn = this.view.addConnector(
        {
            x: 952 + 70,
            y: 390,
        },
       );

       this.view.addBox(
        {
            x: 550,
            y: 460,
        },
        {
            width: 800,
            height: 500,
        }
       );

       this.view.addText(
        {
            x: 180,
            y: 265,
        },
        "A",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 180,
            y: 345,
        },
        "B",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 180,
            y: 235,
        },
        "Ai",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 230,
            y: 235,
        },
        "Bi",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 660,
            y: 235,
        },
        "CO",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 760,
            y: 235,
        },
        "OP0",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 840,
            y: 235,
        },
        "OP1",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 925,
            y: 395,
        },
        "R",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 435,
            y: 685,
        },
        "CI",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 560,
            y: 460,
        },
        "1 Bit ALU",
        { fontSize: 40 },
       );

        if (!this.hideConnAndSwitch) {
            const switchInp1 = 
            this.view.addSwitch(
            {
                x: 100,
                y: 265,
            },
            12,
            (bit) => {

                this.inpBit1 =
                    bit;

                this.update();
            },
            );

        const switchInp2 = 
            this.view.addSwitch(
            {
                x: 100,
                y: 345,
            },
            12,
            (bit) => {

                this.inpBit2 =
                    bit;

                this.update();
            },
            );

        const switchAInv = 
            this.view.addSwitch(
            {
                x: 180,
                y: 150,
            },
            12,
            (bit) => {

                this.aInvertBit =
                    bit;

                this.update();
            },
            );

        const switchBInv = 
            this.view.addSwitch(
            {
                x: 230,
                y: 150,
            },
            12,
            (bit) => {

                this.bInvertBit =
                    bit;

                this.update();
            },
            );

        const switchCarryIn = this.view.addSwitch(
            {
                x: 435,
                y: 770,
            },
            12,
            (bit) => {
                this.carryInBit = bit;
                this.update();
            }
        );

        const switchOp0 = this.view.addSwitch(
            {
                x: 775,
                y: 150,
            },
            12,
            (bit) => {
                this.opBit0 = bit;
                this.update();
            }
        );

        const switchOp1 = this.view.addSwitch(
            {
                x: 825,
                y: 150,
            },
            12,
            (bit) => {
                this.opBit1 = bit;
                this.update();
            }
        );

        this.view.setSwitchBit(switchInp1.switchId, this.inpBit1);
        this.view.setSwitchBit(switchInp2.switchId, this.inpBit2);
        this.view.setSwitchBit(switchAInv.switchId, this.aInvertBit);
        this.view.setSwitchBit(switchBInv.switchId, this.bInvertBit);
        this.view.setSwitchBit(switchCarryIn.switchId, this.carryInBit);
        this.view.setSwitchBit(switchOp0.switchId, this.opBit0);
        this.view.setSwitchBit(switchOp1.switchId, this.opBit1);
        }
    }

    private build1() {
        const level = this.level;

        if (!this.hideConnAndSwitch) {
            this.inpWire1Label = this.view.addText(
                {
                    x: 100,
                    y: 225,
                },
                "",
                {fontSize: 30}
            );

            this.inpWire2Label = this.view.addText(
                {
                    x: 100,
                    y: 305,
                },
                "",
                {fontSize: 30}
            );

            this.aInvertLabel = this.view.addText(
                {
                    x: 200,
                    y: 180,
                },
                "",
                {fontSize: 30}
            );

            this.bInvertLabel = this.view.addText(
                {
                    x: 250,
                    y: 180,
                },
                "",
                {fontSize: 30}
            );

            this.carryOutLabel = this.view.addText(
                {
                    x: 690,
                    y: 140,
                },
                "",
                {fontSize: 30}
            );

            this.op0Label = this.view.addText(
                {
                    x: 795,
                    y: 180,
                },
                "",
                {fontSize: 30}
            );

            this.op1Label = this.view.addText(
                {
                    x: 845,
                    y: 180,
                },
                "",
                {fontSize: 30}
            );

            this.muxOutLabel = this.view.addText(
                {
                    x: 1022,
                    y: 360,
                },
                "",
                {fontSize: 30}
            );

            this.carryInLabel = this.view.addText(
                {
                    x: 465,
                    y: 755,
                },
                "",
                {fontSize: 30}
            );
        }

       this.inpWire1 = this.view.addWire(
        {
            x: 100,
            y: 265,
        },
        182,
        "horz",
       );

       this.aInvertWire = this.view.addWire(
        {
            x: 180,
            y: 150,
        },
        85,
        "vert",
       );

       this.aInvertWireh = this.view.addWire(
        {
            x: 180,
            y: 235,
        },
        102,
        "horz",
       );

       this.inpWire2 = this.view.addWire(
        {
            x: 100,
            y: 345,
        },
        182,
        "horz",
       );

       this.bInvertWire = this.view.addWire(
        {
            x: 230,
            y: 150,
        },
        165,
        "vert",
       );

       this.bInvertWireh = this.view.addWire(
        {
            x: 230,
            y: 315,
        },
        52,
        "horz",
       );

       this.view.addXorGate(
        {
            x: 300,
            y: 250,
        },
        {
            width: 60,
            height: 60,
        }
       );

       this.view.addXorGate(
        {
            x: 300,
            y: 330,
        },
        {
            width: 60,
            height: 60,
        }
       );

       this.andInpAWire = this.view.addWire(
        {
            x: 330,
            y: 250,
        },
        170,
        "horz",
       );

       this.andInpBWire = this.view.addWire(
        {
            x: 330,
            y: 330,
        },
        170,
        "horz",
       );

       this.view.addAndGate(
        {
            x: 550,
            y: 290,
        },
        {
            width: 100,
            height: 100,
        }
       );

       this.orInpAConn = this.view.addConnector(
        {
            x: 410,
            y: 385,
        }
       );

       this.orInpAWire = this.view.addWire(
        {
            x: 410,
            y: 385,
        },
        110,
        "horz",
       );

       this.orInpBConn = this.view.addConnector(
        {
            x: 360,
            y: 432,
        }
       );

       this.orInpBWire = this.view.addWire(
        {
            x: 360,
            y: 432,
        },
        165,
        "horz",
       );

       this.view.addOrGate(
        {
            x: 550,
            y: 410,
        },
        {
            width: 100,
            height: 100,
        }
       );

       this.xorInpAConn = this.view.addConnector(
        {
            x: 410,
            y: 385 + 120,
        }
       );

       this.xorInpAWire = this.view.addWire(
        {
            x: 410,
            y: 385 + 120,
        },
        110,
        "horz",
       );

       this.xorInpBConn = this.view.addConnector(
        {
            x: 360,
            y: 432 + 120,
        }
       );

       this.xorInpBWire = this.view.addWire(
        {
            x: 360,
            y: 432 + 120,
        },
        165,
        "horz",
       );

       this.view.addXorGate(
        {
            x: 550,
            y: 530,
        },
        {
            width: 100,
            height: 100,
        }
       );


       this.adderInpAConn = this.view.addConnector(
        {
            x: 410,
            y: 250,
        },
       );

       this.adderInpAWire = this.view.addWire(
        {
            x: 410,
            y: 250,
        },
        415,
        "vert",
       );

       this.adderInpAWireh = this.view.addWire(
        {
            x: 410,
            y: 665,
        },
        80,
        "horz",
       );

       this.adderInpBConn = this.view.addConnector(
        {
            x: 360,
            y: 330,
        },
       );

       this.adderInpBWire = this.view.addWire(
        {
            x: 360,
            y: 330,
        },
        375,
        "vert",
       );

       this.adderInpBWireh = this.view.addWire(
        {
            x: 360,
            y: 707,
        },
        130,
        "horz",
       );

       this.carryInWire = this.view.addWire(
        {
            x: 435,
            y: 770,
        },
        -145,
        "vert",
       );

       this.carryInWireh = this.view.addWire(
        {
            x: 435,
            y: 770 - 145,
        },
        55,
        "horz",
       );

       if (!this.hideConnAndSwitch) {
        this.view.addText(
        {
            x: 50,
            y: 265,
        },
        "A",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 50,
            y: 345,
        },
        "B",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 180,
            y: 110,
        },
        "Ai",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 230,
            y: 110,
        },
        "Bi",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 660,
            y: 110,
        },
        "CO",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 760,
            y: 110,
        },
        "OP0",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 840,
            y: 110,
        },
        "OP1",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 1055,
            y: 395,
        },
        "R",
        { fontSize: 30 },
       );

       this.view.addText(
        {
            x: 435,
            y: 815,
        },
        "CI",
        { fontSize: 30 },
       );
       }

       this.fullAdder = new FullAdderCircuit(true);
       this.fullAdder.setLevel(level - 1, false);
       this.view.element.appendChild(this.fullAdder.element);
       this.fullAdder.getView.resize(.38);
       this.fullAdder.getView.moveBy(320, 570);

       this.andOutWire = this.view.addWire(
        {
            x: 604,
            y: 290,
        },
        145,
        "horz",
       );

       this.orOutWire = this.view.addWire(
        {
            x: 603,
            y: 410,
        },
        20,
        "horz",
       );

       this.orOutWirev = this.view.addWire(
        {
            x: 623,
            y: 410,
        },
        -45,
        "vert",
       );

       this.orOutWirevh = this.view.addWire(
        {
            x: 623,
            y: 410 - 45,
        },
        125,
        "horz",
       );

       this.xorOutWire = this.view.addWire(
        {
            x: 603,
            y: 530,
        },
        40,
        "horz",
       );

       this.xorOutWirev = this.view.addWire(
        {
            x: 643,
            y: 530,
        },
        -90,
        "vert",
       );

       this.xorOutWirevh = this.view.addWire(
        {
            x: 643,
            y: 530 - 90,
        },
        105,
        "horz",
       );

       this.sumOutWire = this.view.addWire(
        {
            x: 607,
            y: 635,
        },
        80,
        "horz",
       );

       this.sumOutWirev = this.view.addWire(
        {
            x: 687,
            y: 635,
        },
        -120,
        "vert",
       );

       this.sumOutWirevh = this.view.addWire(
        {
            x: 687,
            y: 635 - 120,
        },
        61,
        "horz",
       );

       this.carryOutWire = this.view.addWire(
        {
            x: 660,
            y: 150,
        },
        540,
        "vert",
       );

       if (!this.hideConnAndSwitch)
       this.carryOutConn = this.view.addConnector(
        {
            x: 660,
            y: 150,
        },
       );

       this.carryOutWireh = this.view.addWire(
        {
            x: 660,
            y: 690,
        },
        -53,
        "horz",
       );

       this.op0Wire = this.view.addWire(
        {
            x: 775,
            y: 150,
        },
        87,
        "vert",
       );

       this.op1Wire = this.view.addWire(
        {
            x: 825,
            y: 150,
        },
        87,
        "vert",
       );

       this.mux = new Selector4to1Circuit(true);
       this.mux.setLevel(level - 1, false);
       this.view.element.appendChild(this.mux.element);
       this.mux.getView.resize(.5);
       this.mux.getView.moveBy(550, 190);

       this.muxOutWire = this.view.addWire(
        {
            x: level <= 1 ? 952 : 970,
            y: 390,
        },
        level <= 1 ? 70 : 52,
        "horz",
       );

       if (!this.hideConnAndSwitch)
       this.muxOutConn = this.view.addConnector(
        {
            x: 952 + 70,
            y: 390,
        },
       );

        if (!this.hideConnAndSwitch) {
            const switchInp1 = 
            this.view.addSwitch(
            {
                x: 100,
                y: 265,
            },
            12,
            (bit) => {

                this.inpBit1 =
                    bit;

                this.update();
            },
            );

        const switchInp2 = 
            this.view.addSwitch(
            {
                x: 100,
                y: 345,
            },
            12,
            (bit) => {

                this.inpBit2 =
                    bit;

                this.update();
            },
            );

        const switchAInv = 
            this.view.addSwitch(
            {
                x: 180,
                y: 150,
            },
            12,
            (bit) => {

                this.aInvertBit =
                    bit;

                this.update();
            },
            );

        const switchBInv = 
            this.view.addSwitch(
            {
                x: 230,
                y: 150,
            },
            12,
            (bit) => {

                this.bInvertBit =
                    bit;

                this.update();
            },
            );

        const switchCarryIn = this.view.addSwitch(
            {
                x: 435,
                y: 770,
            },
            12,
            (bit) => {
                this.carryInBit = bit;
                this.update();
            }
        );

        const switchOp0 = this.view.addSwitch(
            {
                x: 775,
                y: 150,
            },
            12,
            (bit) => {
                this.opBit0 = bit;
                this.update();
            }
        );

        const switchOp1 = this.view.addSwitch(
            {
                x: 825,
                y: 150,
            },
            12,
            (bit) => {
                this.opBit1 = bit;
                this.update();
            }
        );

        this.view.setSwitchBit(switchInp1.switchId, this.inpBit1);
        this.view.setSwitchBit(switchInp2.switchId, this.inpBit2);
        this.view.setSwitchBit(switchAInv.switchId, this.aInvertBit);
        this.view.setSwitchBit(switchBInv.switchId, this.bInvertBit);
        this.view.setSwitchBit(switchCarryIn.switchId, this.carryInBit);
        this.view.setSwitchBit(switchOp0.switchId, this.opBit0);
        this.view.setSwitchBit(switchOp1.switchId, this.opBit1);
        }
    }

    private update0() {
        const a = this.inpBit1;
        const b = this.inpBit2;

        const aInvert = this.aInvertBit;
        const bInvert = this.bInvertBit;

        const carryIn = this.carryInBit;
        
        const op0 = this.opBit0;
        const op1 = this.opBit1;

        this.setSignal(
            a,
            this.inpWire1,
        );

        this.setSignal(
            b,
            this.inpWire2,
        );

        this.setSignal(
            aInvert,
            this.aInvertWire,
        );

        this.setSignal(
            bInvert,
            this.bInvertWire,
        );

        this.setSignal(
            carryIn,
            this.carryInWire,
        );

        this.setSignal(
            op0,
            this.op0Wire,
        );

        this.setSignal(
            op1,
            this.op1Wire,
        );

        const [result, carryOut] = aluBit1(carryIn, a, b, [aInvert, bInvert, op0, op1])

        this.setSignal(
            result,
            this.muxOutWire,
            this.muxOutConn,
        );

        this.setSignal(
            carryOut,
            this.carryOutWire,
            this.carryOutConn,
        );

        if (!this.hideConnAndSwitch) {
            this.view.setTextBitAnimated(this.inpWire1Label.textId, a);
            this.view.setTextBitAnimated(this.inpWire2Label.textId, b);
            this.view.setTextBitAnimated(this.aInvertLabel.textId, aInvert);
            this.view.setTextBitAnimated(this.bInvertLabel.textId, bInvert);
            this.view.setTextBitAnimated(this.carryInLabel.textId, carryIn);
            this.view.setTextBitAnimated(this.carryOutLabel.textId, carryOut);
            this.view.setTextBitAnimated(this.op0Label.textId, op0);
            this.view.setTextBitAnimated(this.op1Label.textId, op1);
            this.view.setTextBitAnimated(this.muxOutLabel.textId, result);
        }
    }

    private update1() {
        const a = this.inpBit1;
        const b = this.inpBit2;

        const aInvert = this.aInvertBit;
        const bInvert = this.bInvertBit;

        const carryIn = this.carryInBit;
        
        const op0 = this.opBit0;
        const op1 = this.opBit1;

        this.setSignal(
            a,
            this.inpWire1,
        );

        this.setSignal(
            b,
            this.inpWire2,
        );

        this.setSignal(
            aInvert,
            this.aInvertWire,
            undefined,
            this.aInvertWireh,
        );

        this.setSignal(
            bInvert,
            this.bInvertWire,
            undefined,
            this.bInvertWireh,
        );

        this.setSignal(
            carryIn,
            this.carryInWire,
            undefined,
            this.carryInWireh,
        );

        this.setSignal(
            op0,
            this.op0Wire,
        );

        this.setSignal(
            op1,
            this.op1Wire,
        );

        const xorA = xorGate(a, aInvert);
        const xorB = xorGate(b, bInvert);

        this.setSignal(
            xorA,
            this.andInpAWire,
            this.adderInpAConn,
            this.adderInpAWire,
            this.adderInpAWireh,
        );

        this.setSignal(
            xorB,
            this.andInpBWire,
            this.adderInpBConn,
            this.adderInpBWire,
            this.adderInpBWireh,
        );

        this.setSignal(
            xorA,
            this.orInpAWire,
            this.orInpAConn,
        );

        this.setSignal(
            xorB,
            this.orInpBWire,
            this.orInpBConn,
        );

        this.setSignal(
            xorA,
            this.xorInpAWire,
            this.xorInpAConn,
        );

        this.setSignal(
            xorB,
            this.xorInpBWire,
            this.xorInpBConn,
        );

        const andOut = andGate(xorA, xorB);
        const orOut = orGate(xorA, xorB);
        const xorOut = xorGate(xorA, xorB);
        const [sum, carryOut] = this.fullAdder.setInputs(carryIn, xorA, xorB);

        this.setSignal(
            andOut,
            this.andOutWire,
        );

        this.setSignal(
            orOut,
            this.orOutWire,
            undefined,
            this.orOutWirev,
            this.orOutWirevh,
        );

        this.setSignal(
            xorOut,
            this.xorOutWire,
            undefined,
            this.xorOutWirev,
            this.xorOutWirevh,
        );

        this.setSignal(
            sum,
            this.sumOutWire,
            undefined,
            this.sumOutWirev,
            this.sumOutWirevh,
        );

        this.setSignal(
            carryOut,
            this.carryOutWireh,
            this.carryOutConn,
            this.carryOutWire,
        );

        const muxOut = this.mux.setInputs([andOut, orOut, xorOut, sum], [op0, op1]);
        
        this.setSignal(
            muxOut,
            this.muxOutWire,
            this.muxOutConn,
        );

        if (!this.hideConnAndSwitch) {
            this.view.setTextBitAnimated(this.inpWire1Label.textId, a);
            this.view.setTextBitAnimated(this.inpWire2Label.textId, b);
            this.view.setTextBitAnimated(this.aInvertLabel.textId, aInvert);
            this.view.setTextBitAnimated(this.bInvertLabel.textId, bInvert);
            this.view.setTextBitAnimated(this.carryInLabel.textId, carryIn);
            this.view.setTextBitAnimated(this.carryOutLabel.textId, carryOut);
            this.view.setTextBitAnimated(this.op0Label.textId, op0);
            this.view.setTextBitAnimated(this.op1Label.textId, op1);
            this.view.setTextBitAnimated(this.muxOutLabel.textId, muxOut);
        }
    }

    // =========================================================
    // SIGNAL HELPER
    // =========================================================

    private setSignal(
        bit: Bit,
        wire: WireResult,
        connector?: ConnectorResult,
        ...additionalWires: WireResult[]
    ): void {

        this.view.setWireBit(
            wire.wireId,
            bit,
        );

        if (connector) this.view.setConnectorBit(
            connector.connectorId,
            bit,
        );

        for (
            const additionalWire
            of additionalWires
        ) {

            this.view.setWireBit(
                additionalWire.wireId,
                bit,
            );
        }
    }
}