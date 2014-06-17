

QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
  //The following are counter-examples showing how the Date object will 
  //wrangle several 'bad' dates into a valid date anyway
  assert.equal(isValidDate(new Date(1980, 12, 15)), true);
  d = new Date();
  d.setFullYear(1980);
  d.setMonth(1);
  d.setDate(33);
  assert.equal(isValidDate(new Date(1980, 100, 150)), true);
  assert.equal(isValidDate(d), true);
  //If you go to this exterme, then the checker will fail
  assert.equal(isValidDate(new Date("This is junk")), false);
  //This is a valid date string
  assert.equal(isValidDate(new Date("November 17, 1989")), true);
  //but is this?
  //Ha!  It's not.  So, the secret to working with this version of 
  //isValidDate is to pass in dates as text strings... Hooboy
  assert.equal(isValidDate(new Date("November 35, 1989")), false);  
  //alert(d.toString());
});

