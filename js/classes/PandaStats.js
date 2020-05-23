/**
 * @param  {number} myId
 * @param  {number} dbId
 */
class PandaStats {
  constructor(myId, dbId) {
    this.myId = myId;
    this.dbId = dbId;
    this.collecting = false;
    this.collectStart = null;
    this.collectAccepted = 0;
    this.secondsCollecting = 0;
    this.secondsCollected = 0;
    this.collectStore = "collectionStore";
    this.acceptedStore = "acceptedStore";
    this.fetched = { value:0, id:"#pcm_hitFetched", label:"Fetched" };
    this.accepted = { value:0, id:"#pcm_hitAccepted", label:"Acc" };
    this.noMore = { value:0, id:"#pcm_hitNoMore", label:"NM" };
    this.acceptedTimes = [];
    this.updateAllStats();
  }
  /**
   * @param  {} data
   */
  collectStatsDB(data) { pandaUI.dbStats.addToDB( this.collectStore, data ).then( () => {} ); }
  /**
   * @param  {} data
   */
  acceptedStatsDB(data) { pandaUI.dbStats.addToDB( this.acceptedStore, data ).then( () => {} ); }
  /**
   * @param  {} id
   */
  deleteIdFromDB(id) {
		pandaUI.dbStats.deleteFromDB(this.collectStore, id, "dbId")
    .then( null, (rejected) => console.error(rejected));
		pandaUI.dbStats.deleteFromDB(this.acceptedStore, id, "dbId")
    .then( null, (rejected) => console.error(rejected));
  }
  /**
   */
  updateAllStats() {
		$(`${this.accepted.id}_${this.myId}`).html(`${this.accepted.label}: ${this.accepted.value}`);
		$(`${this.fetched.id}_${this.myId}`).html(`${this.fetched.label}: ${this.fetched.value}`);
  }
  /**
   * @param  {} statObj
   */
  updateHitStat(statObj) {
		$(`${statObj.id}_${this.myId}`).html(`${statObj.label}: ${statObj.value}`);
  }
  /**
   * @param  {} end
   */
  addToSeconds(end) { this.secondsCollecting += Math.floor( (end - this.collectStart) / 1000); }
  /**
   * @param  {} end
   */
  addTocollectTimes(end) { this.collectStatsDB( {dbId:this.dbId, start:this.collectStart, end:end} ); }
  /**
   */
  addToacceptedTimes() { this.acceptedStatsDB( {dbId:this.dbId, date:new Date().getTime()} ); }
  /**
   */
  addFetched() { this.fetched.value++; this.updateHitStat(this.fetched); }
  /**
   */
  addAccepted() {
    this.accepted.value++; this.addToacceptedTimes();
    this.collectAccepted++; this.updateHitStat(this.accepted);
  }
  /**
   */
  addNoMore() { this.noMore.value++; this.updateHitStat(this.noMore); }
  /**
   */
  startCollecting() { this.collecting = true; this.collectStart = new Date().getTime(); this.collectAccepted = 0; }
  /**
   */
  stopCollecting() {
    const ended = new Date().getTime(); this.collecting = false;
    this.addToSeconds(ended); this.addTocollectTimes(ended); this.collectStart = null;
    return {seconds:this.secondsCollecting, accepted:this.collectAccepted};
  }
}