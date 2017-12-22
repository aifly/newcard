export default class ZmitiBg {
	constructor(option = {}) {
		this.scene = option.scene;
		this.vue = option.vue;
		this.key = option.key || 'particle1'
		this.create();

	}
	create() {
		var bg1Geo = new THREE.PlaneGeometry(200, 200, 200, 200);
		var bg1Material = new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load(this.vue.$refs['particle1'].src)
		});
		bg1Material.transparent = true;
		var bg1 = new THREE.Mesh(bg1Geo, bg1Material);
		this.scene.add(bg1);
		this.bg = bg1;
	}

}