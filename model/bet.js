function Bet(opts) {
    this.teamId = opts.teamId;
    this.amount = opts.amount;
    this.address = opts.address;
    this.isDraw = opts.isDraw;
}

module.exports = Bet;