class PandaCard {
  constructor(myId, pandaObj, tabsObj, tabUnique=null) {
    this.myId = myId;
    this.pandaObj = pandaObj;
    this.tabsObj = tabsObj;
    this.reqName = {valueName:"reqName", id:"#pcm_hitReqName", label:""};
    this.friendlyReqName = {valueName:"friendlyReqName", id:"#pcm_hitReqName", label:""};
    this.groupId = {valueName:"groupId", id:"#pcm_groupId", label:""};
    this.price = {valueName:"price", id:"#pcm_hitPrice", label:""};
    this.numbers = {valueName:"hitsAvailable", id:"#pcm_numbers", label:""};
    this.title = {valueName:"title", id:"#pcm_hitTitle", label:""};
    this.friendlyTitle = {valueName:"friendlyTitle", id:"#pcm_hitTitle", label:""};
    this.appendCard(tabUnique);
    this.updateAllCardInfo();
  }
  updateAllCardInfo() {
    let reqName = (this.pandaObj[this.friendlyReqName.valueName]!=="") ? this.pandaObj[this.friendlyReqName.valueName] : this.pandaObj[this.reqName.valueName];
		$(`${this.reqName.id}_${this.myId}`).html(`${reqName}`);
		$(`${this.groupId.id}_${this.myId}`).html(`${shortenGroupId(this.pandaObj[this.groupId.valueName])}`);
		$(`${this.price.id}_${this.myId}`).html(`${this.pandaObj[this.price.valueName]}`);
		if (this.pandaObj[this.numbers.valueName]>1) $(`${this.numbers.id}_${this.myId}`).html(`[${this.pandaObj[this.numbers.valueName]}]`);
    let title = (this.pandaObj[this.friendlyTitle.valueName]!=="") ? this.pandaObj[this.friendlyTitle.valueName] : this.pandaObj[this.title.valueName];
		$(`${this.title.id}_${this.myId}`).html(`${title}`);
  }
  createCardStatus(appendHere) {
    $(`<div class="pcm_hitStats" id="pcm_hitStats_${this.myId}"></div>`).html(`[ <span class="pcm_hitAccepted" id="pcm_hitAccepted_${this.myId}"></span> | <span class="pcm_hitFetched" id="pcm_hitFetched_${this.myId}"></span> ]`).appendTo(appendHere)
  }
  createCardButtonGroup(appendhere) {
    const group = $(`<div class="card-text" id="pcm_buttonGroup_${this.myId}"></div>`).appendTo(appendhere);
    $(`<button class="btn btn-light btn-xs btn-outline-dark toggle-text pcm_hitButton pcm_collectButton pcm_buttonOff shadow-none" id="pcm_collectButton_${this.myId}"></button>`).append($(`<span>Collect</span>`)).appendTo(group);
    $(`<button class="btn btn-light btn-xs btn-outline-dark toggle-text pcm_hitButton pcm_hamButton pcm_buttonOff shadow-none" id="pcm_hamButton_${this.myId}"></button>`).append($(`<span>GoHam</span>`)).appendTo(group);
    $(`<button class="btn btn-light btn-xs btn-outline-dark toggle-text pcm_hitButton pcm_detailsButton pcm_buttonOff shadow-none" id="pcm_detailsButton_${this.myId}"></button>`).append($(`<span>Details</span>`)).appendTo(group);
    $(`<button class="btn btn-light btn-xs btn-outline-dark toggle-text pcm_hitButton pcm_deleteButton pcm_buttonOff shadow-none" id="pcm_deleteButton_${this.myId}"></button>`).append($(`<span>X</span>`)).appendTo(group);
  }
  createCard(appendHere) {
    const card = $(`<div class="card text-light border pcm_pandaCard" id="pcm_pandaCard_${this.myId}"></div>`).data("pandaObj",this.pandaObj).data("pandaObj",this.pandaObj).appendTo(appendHere);
    const body = $(`<div class="card-body p-0"></div>`).appendTo(card);
    const text = $(`<div class="card-text p-0" id="output_${this.myId}">`).appendTo(body);
    $(`<div class="pcm_nameGroup row w-100 px-0"></div>`).append($(`<span class="pcm_reqName col mr-auto px-0 text-truncate" id="pcm_hitReqName_${this.myId}"></span>`)).append($(`<span class="pcm_groupId col col-auto text-right px-0" id="pcm_groupId_${this.myId}"></span>`)).appendTo(text);
    $(`<div class="pcm_priceGroup"></div>`).append($(`<span class="pcm_price text-truncate" id="pcm_hitPrice_${this.myId}"></span>`)).append($(`<span class="pcm_numbers text-truncate" id="pcm_numbers_${this.myId}"></span>`)).appendTo(text);
    $(`<div class="pcm_title text-truncate" id="pcm_hitTitle_${this.myId}"></div>`).appendTo(text);
    this.createCardStatus(text);
    this.createCardButtonGroup(text);
  }
  appendCard(tabUnique=null) {
    const thisTabUnique = (tabUnique) ? tabUnique : this.tabsObj.currentTab; console.log(thisTabUnique);
    this.createCard($(`#pcm-t${thisTabUnique}Content .card-deck`));
  }
  removeCard(removeFunc) {
    $(`#pcm_pandaCard_${this.myId}`).effect('slide', { direction:'left', mode:'hide' }, 500, () => { 
      $(`#pcm_pandaCard_${this.myId}`).remove(); removeFunc.apply();
    });
  }
}