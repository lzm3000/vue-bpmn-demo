<template>
  <div class="containers" ref="content">
    <div class="canvas" ref="canvas"></div>
    <div id="js-properties-panel" class="panel"></div>
    <div id="process-xml">
    </div>

    <ul class="buttons">
      <li>下载</li>
      <li>
        <a ref="saveDiagram" href="javascript:" title="download BPMN diagram">BPMN</a>
      </li>
      <li>
        <a ref="saveSvg" href="javascript:" title="download as SVG image">SVG</a>
      </li>
    </ul>
  </div>
</template>

<script>
import BpmnModeler from "bpmn-js/lib/Modeler";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import customTranslateModule from "../bpmn-config/customTranslate";

export default {
  data() {
    return {
      bpmnModeler: null,
      container: null,
      canvas: null,
      xmlStr: null,
      bpmnXmlStr: null
    };
  },
  methods: {
    createNewDiagram() {
      this.bpmnXmlStr =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">\n' +
        '  <bpmn:process isExecutable="true"></bpmn:process>\n' +
        "  <bpmndi:BPMNDiagram >\n" +
        "    <bpmndi:BPMNPlane></bpmndi:BPMNPlane>\n" +
        "  </bpmndi:BPMNDiagram>\n" +
        "</bpmn:definitions>";
      this.bpmnModeler.importXML(this.bpmnXmlStr, function(err) {
        if (err) {
          console.error(err);
        }
      });
    },

    saveSVG(done) {
      this.bpmnModeler.saveSVG(done);
    },
    saveDiagram(done) {
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        done(err, xml);
      });
    },
    setEncoded(link, name, data) {
      const encodedData = encodeURIComponent(data);
      this.xmlStr = data;
      if (data) {
        link.className = "active";
        link.href = "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
        link.download = name;
      }
    }
  },

  mounted() {
    this.container = this.$refs.content;
    const canvas = this.$refs.canvas;
    this.bpmnModeler = new BpmnModeler({
      container: canvas,
      propertiesPanel: {
        parent: "#js-properties-panel"
      },
      additionalModules: [
        propertiesProviderModule,
        propertiesPanelModule,
        customTranslateModule
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    });

    let _this = this;
    const downloadLink = this.$refs.saveDiagram;
    const downloadSvgLink = this.$refs.saveSvg;
    this.bpmnModeler.on("commandStack.changed", function() {
      _this.saveSVG(function(err, svg) {
        _this.setEncoded(downloadSvgLink, "diagram.svg", err ? null : svg);
      });

      _this.saveDiagram(function(err, xml) {
        _this.setEncoded(downloadLink, "diagram.xml", err ? null : xml);
      });
    });

    this.createNewDiagram(this.bpmnModeler);

  },

};
</script>

<style lang="scss">
@import "bpmn-js/dist/assets/diagram-js.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
@import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";
.containers {
  position: absolute;
  background-color: #ffffff;
  width: 100%;
  height: 100%;
}
.canvas {
  width: 100%;
  height: 100%;
}
.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
#process-xml {
  position: absolute;
  left: 300px;
  bottom: 38px;
  & > a {
    display: inline-block;
    width: 60px;
    height: 20px;
    padding: 1px;
    font-size: 14px;
    line-height: 20px;
    text-decoration: none;
    color: black;
    background: #eee;
    border: 1px solid #ccc;
  }
}
.buttons {
  position: absolute;
  left: 20px;
  bottom: 20px;
  & > li {
    display: inline-block;
    margin: 5px;
    & > a {
      color: #999;
      background: #eee;
      cursor: not-allowed;
      padding: 6px;
      border: 1px solid #ccc;
      text-decoration: none;
      &.active {
        color: #333;
        background: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
