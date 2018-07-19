define(["Tone/component/ScaledEnvelope", "helper/Basic", "helper/Offline", "Test", "Tone/component/Envelope"], 
	function (ScaledEnvelope, Basic, Offline, Test, Envelope) {
		describe("ScaledEnvelope", function(){

			Basic(ScaledEnvelope);

			context("ScaledEnvelope", function(){

				it("has an output connections", function(){
					var env = new ScaledEnvelope();
					env.connect(Test);
					env.dispose();
				});

				it("extends Envelope", function(){
					var env = new ScaledEnvelope();
					expect(env).to.be.instanceOf(Envelope);
					env.dispose();
				});

				it("can get and set values an Objects", function(){
					var env = new ScaledEnvelope();
					var values = {
						"attack" : 0,
						"release" : "4n",
						"min" : 2,
						"max" : 4
					};
					env.set(values);
					expect(env.get()).to.contain.keys(Object.keys(values));
					expect(env.min).to.equal(2);
					expect(env.max).to.equal(4);
					env.dispose();
				});

				it("can take parameters as both an object and as arguments", function(){
					var env0 = new ScaledEnvelope({
						"attack" : 0,
						"decay" : 0.5,
						"sustain" : 1
					});
					expect(env0.attack).to.equal(0);
					expect(env0.decay).to.equal(0.5);
					expect(env0.sustain).to.equal(1);
					env0.dispose();
					var env1 = new ScaledEnvelope(0.1, 0.2, 0.3);
					expect(env1.attack).to.equal(0.1);
					expect(env1.decay).to.equal(0.2);
					expect(env1.sustain).to.equal(0.3);
					env1.dispose();
				});

				it("goes to the scaled range", function(){
					var env;
					return Offline(function(){
						env = new ScaledEnvelope(0.01, 0.4, 1);
						env.min = 5;
						env.max = 10;
						env.attackCurve = "exponential";
						env.toMaster();
						env.triggerAttack(0);
					}, 0.3).then(function(buffer){
						buffer.forEach(function(sample, time){
							if (time < env.attack){
								expect(sample).to.be.within(5, 10);
							} else if (time < env.attack + env.decay){
								expect(sample).to.be.closeTo(10, 0.1);
							} 
						});
					});
				});
			});
		});
	});
