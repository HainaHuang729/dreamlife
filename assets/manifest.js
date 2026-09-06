window.ChenguAssetManifest = {
  version: 1,
  grid: {
    tileSize: 32
  },
  sprites: {
    farmhouse: {
      type: "building",
      src: "assets/sprites/farmhouse.svg",
      widthTiles: 5,
      heightTiles: 4,
      anchor: { x: 0, y: 0 },
      collision: { x: 0.4, y: 1.8, width: 4.2, height: 2.0 },
      tags: ["farm", "home"]
    },
    greenhouse: {
      type: "building",
      src: "assets/sprites/greenhouse.svg",
      widthTiles: 4,
      heightTiles: 3,
      anchor: { x: 0, y: 0 },
      collision: { x: 0.2, y: 1.1, width: 3.6, height: 1.6 },
      tags: ["farm", "flower"]
    },
    seedStand: {
      type: "building",
      src: "assets/sprites/seed-stand.svg",
      widthTiles: 3,
      heightTiles: 2,
      anchor: { x: 0, y: 0 },
      collision: { x: 0.1, y: 0.7, width: 2.8, height: 1.2 },
      tags: ["farm", "shop"]
    },
    chickenCoop: {
      type: "building",
      src: "assets/sprites/chicken-coop.svg",
      widthTiles: 3,
      heightTiles: 3,
      anchor: { x: 0, y: 0 },
      collision: { x: 0.2, y: 1.2, width: 2.6, height: 1.5 },
      tags: ["farm", "livestock"]
    },
    villageShop: {
      type: "building",
      src: "assets/sprites/village-shop.svg",
      widthTiles: 5,
      heightTiles: 4,
      anchor: { x: 0, y: 0 },
      collision: { x: 0.3, y: 1.7, width: 4.4, height: 2.1 },
      tags: ["village", "shop"]
    },
    clinic: {
      type: "building",
      src: "assets/sprites/clinic.svg",
      widthTiles: 5,
      heightTiles: 4,
      anchor: { x: 0, y: 0 },
      collision: { x: 0.3, y: 1.7, width: 4.4, height: 2.1 },
      tags: ["village", "service"]
    },
    teahouse: {
      type: "building",
      src: "assets/sprites/teahouse.svg",
      widthTiles: 5,
      heightTiles: 4,
      anchor: { x: 0, y: 0 },
      collision: { x: 0.3, y: 1.7, width: 4.4, height: 2.1 },
      tags: ["village", "food"]
    },
    visitorKiosk: {
      type: "building",
      src: "assets/sprites/visitor-kiosk.svg",
      widthTiles: 3,
      heightTiles: 2,
      anchor: { x: 0, y: 0 },
      collision: { x: 0.1, y: 0.8, width: 2.8, height: 1.1 },
      tags: ["scenic", "tourism"]
    }
  },
  artDirection: {
    threeQuarterFarmRpgStyleV1: {
      type: "concept",
      src: "assets/concept/three-quarter-farm-rpg-style-v1.png",
      perspective: "locked three-quarter top-down 2D",
      depth: "Y-sort object overlap",
      tags: ["modern-countryside", "farming-rpg", "pixel-art", "spring"]
    },
    coreFarmVillageConcept: {
      type: "concept",
      src: "assets/concept/chengu-core-farm-village-concept.png",
      perspective: "locked three-quarter top-down 2D",
      depth: "Y-sort object overlap",
      tags: ["farm", "village", "main-street", "modern-countryside", "concept-board"]
    },
    mountainTourismConcept: {
      type: "concept",
      src: "assets/concept/chengu-mountain-tourism-concept.png",
      perspective: "locked three-quarter top-down 2D",
      depth: "Y-sort object overlap",
      tags: ["scenic", "mountain", "tourism", "ecology", "concept-board"]
    },
    infrastructureTransportConcept: {
      type: "concept",
      src: "assets/concept/chengu-infrastructure-transport-concept.png",
      perspective: "locked three-quarter top-down 2D",
      depth: "Y-sort object overlap",
      tags: ["waterworks", "wetland", "station", "cold-chain", "concept-board"]
    },
    smallScenesConcept: {
      type: "concept",
      src: "assets/concept/chengu-small-scenes-concept.png",
      perspective: "locked three-quarter top-down 2D",
      depth: "Y-sort object overlap",
      tags: ["interior", "warehouse", "homestay", "stone-house", "cold-chain", "concept-board"]
    },
    practicalSceneMockups: {
      type: "concept-set",
      perspective: "locked three-quarter top-down 2D",
      depth: "Y-sort object overlap",
      style: "practical low-to-mid detail browser Canvas 2D target",
      scenes: {
        farm: "assets/concept/practical-scenes/farm.png",
        villageMainStreet: "assets/concept/practical-scenes/village-main-street.png",
        homeInterior: "assets/concept/practical-scenes/home-interior.png",
        pasture: "assets/concept/practical-scenes/pasture.png",
        scenicValley: "assets/concept/practical-scenes/scenic-valley.png",
        workshopDistrict: "assets/concept/practical-scenes/workshop-district.png",
        waterworks: "assets/concept/practical-scenes/waterworks.png",
        wetlandReserve: "assets/concept/practical-scenes/wetland-reserve.png",
        stationShuttle: "assets/concept/practical-scenes/station-shuttle.png",
        alpineTrail: "assets/concept/practical-scenes/alpine-trail.png",
        terraceForestEdge: "assets/concept/practical-scenes/terrace-forest-edge.png",
        cooperativeWarehouse: "assets/concept/practical-scenes/cooperative-warehouse.png",
        homestayCourtyard: "assets/concept/practical-scenes/homestay-courtyard.png",
        oldStoneHouseInterior: "assets/concept/practical-scenes/old-stone-house-interior.png",
        coldChainWarehouse: "assets/concept/practical-scenes/cold-chain-warehouse.png",
        bambooPickleWorkshop: "assets/concept/practical-scenes/bamboo-pickle-workshop.png"
      },
      tags: ["practical-scene-mockup", "browser-canvas-2d", "map-target"]
    }
  },
  tilesets: {},
  maps: {}
};
