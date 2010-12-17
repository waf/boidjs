/*
 * This file defines the Boid object
 * Each Boid is responsible for steering itself and avoiding flockmates
 * http://en.wikipedia.org/wiki/Boids
 */

// Helper class, encapsulate vector math
// the boid simulation will work in 3D if you uncomment the 3D part of the distance func
function Vector(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;

	this.add = function(v) {
		return new Vector(this.x + v.x,
						  this.y + v.y,
						  this.z + v.z);
	}

	this.subtract = function(v) {
		return this.add(v.multiply(-1));
	}

	this.multiply = function(scalar) {
		return new Vector(this.x * scalar,
						  this.y * scalar,
						  this.z * scalar);
	}

	this.divide = function(scalar) {
		return this.multiply(1.0/scalar);
	}

	this.distance = function(v) {
		var d = this.subtract(v);
		return Math.sqrt(d.x*d.x + d.y*d.y);// + d.z*d.z);
	}

	this.magnitude = function() {
		return Math.abs((new Vector(0,0,0)).distance(this));
	}
}

function Boid(flock, pos_vector, max_speed) {
	this.position = pos_vector;
	this.velocity = new Vector(0,0,0);

	this.updatePosition = function(max_position) {
		var perceived_center = new Vector(0,0,0);
		var perceived_velocity = new Vector(0,0,0);
		for(var b in flock) {
			b = flock[b];
			if(b !== this) {

				// accumulate perceived center, so we can steer toward it
				perceived_center = perceived_center.add(b.position);

				// avoid other boids
				if(this.position.distance(b.position) < 40) {
					this.velocity = this.velocity.subtract(b.position.subtract(this.position).divide(10));
				}

				// accumulate perceived velocity, so we can align with it
				perceived_velocity = perceived_velocity.add(b.velocity);
			}
		}

		// steer toward center
		perceived_center = perceived_center.divide(flock.length - 1);
		this.velocity = this.velocity.add(perceived_center.subtract(this.position).divide(100));

		// align with other velocity
		perceived_velocity = perceived_velocity.divide(flock.length - 1);
		this.velocity = this.velocity.add(perceived_velocity.subtract(this.velocity).divide(8));

		// bounding box 
		var boundingBoxModifier = getBoundingBoxModifier(this.position, max_position);
		this.velocity = this.velocity.add(boundingBoxModifier);

		// limit max speed
		var speed = this.velocity.magnitude();
		if(speed > max_speed)
		{
			this.velocity = this.velocity.divide(speed).multiply(max_speed);
		}

		// update position with velocity
		this.position = this.position.add(this.velocity);
	}

	function getBoundingBoxModifier(pos, max_position) {
		var boundingBoxModifier = new Vector(0,0,0);
		var push = 5;
		if( pos.x < 0) {
			boundingBoxModifier.x = push;
		} else if(pos.x > max_position.x) {
			boundingBoxModifier.x = -push;
		}
		if(pos.y < 0) {
			boundingBoxModifier.y = push;
		} else if(pos.y > max_position.y) {
			boundingBoxModifier.y = -push;
		}
		if(pos.z < 0) {
			boundingBoxModifier.z = push;
		} else if(pos.z > max_position.z) {
			boundingBoxModifier.z = -push;
		}
		return boundingBoxModifier;
	}
}
