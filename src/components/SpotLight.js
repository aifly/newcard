export default class SpotLight {
	constructor(option = {}) {
		this.scene = option.scene;
		this.speedX = option.speedX;
		this.speedZ = option.speedZ;
		this.speedY = Math.random() * .5;
		this.alive = Math.random() * 60 + 70;
		this.vue = option.vue;
		this.create();
		this.iNow = 0;
		this.k = Math.random() * 4;
	}
	create() {
		var spotLight = new THREE.SpotLight(0xffffff, 1, 50, Math.PI / 2, .5); //f9f496
		spotLight.position.set(Math.random() * 20, Math.random() * -100, 2);
		this.spotLight = spotLight;
		this.scene.add(spotLight);

		var cubeGeo = new THREE.PlaneGeometry(3, 3, 3);

		var cubeMaterial = new THREE.MeshLambertMaterial({
			map: new THREE.TextureLoader().load(this.vue.$refs['lantern'].src)
		});
		cubeMaterial.transparent = true;
		var cube = new THREE.Mesh(cubeGeo, cubeMaterial);
		//cube.scale.set(.5,.5)
		cube.position.set(0, 0, 0)
		this.scene.add(cube);

		this.cube = cube;
	}
	animate() {

	}
}