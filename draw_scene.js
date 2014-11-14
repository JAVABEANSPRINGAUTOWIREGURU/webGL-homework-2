function Object3D(shape) {
	this.shape = shape;
	this.posRotMatrix = mat4.create();
	this.sclMatrix = mat4.create();
	this.rotation = 0.0;
	mat4.identity(this.posRotMatrix);
	mat4.identity(this.sclMatrix);
	return this;
}

var selected;
var scene;

function build_scene() {
	loadScene();
	scene = [
		new Object3D(pyramid),
		new Object3D(cube),
		new Object3D(cylinder),
		new Object3D(sphere),
		new Object3D(bunny)
	];

	mat4.translate(scene[0].posRotMatrix, [-3.0, 4.0, -15.0]);
	mat4.translate(scene[1].posRotMatrix, [ 0.0, 4.0, -15.0]);
	mat4.translate(scene[2].posRotMatrix, [ 3.0, 4.0, -15.0]);
	mat4.translate(scene[3].posRotMatrix, [-3.0, 0.0, -15.0]);
	mat4.translate(scene[4].posRotMatrix, [ 0.0, 0.0, -15.0]);


};

function draw_scene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.lineWidth(3);

	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);


	// draw coordinate system for selected shape
	for (var i in scene) {

		var object = scene[i];
		mat4.identity(mvMatrix);
		mat4.multiply(mvMatrix, object.posRotMatrix);
		mat4.multiply(mvMatrix, object.sclMatrix);

		// send mvMatrix to the shader
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

		draw_object(object.shape);

		if (i == selected_object_id)
			draw_object(coordinate_system);
	}
}

function draw_object(shape) {
	var vertexPositionBuffer = shape.positionBuffer;
	var vertexColorBuffer = shape.colorBuffer;
	var vertexIndexBuffer = shape.indexBuffer;

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
	gl.drawElements(shape.elementType, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}