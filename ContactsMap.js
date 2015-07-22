/***********************************************************
            Google Contacts Map - Updated
      -----------------------------------------
                     ORIGINAL
           article  :   http://labnol.org/?p=26107
           contact  :   amit@labnol.org
           twitter  :   @labnol             

                     UPDATE
            author  :   Ondřej Borýsek
           website  :   https://borysek.net
           
************************************************************/

function Start() {
  var attach = [{fileName:"address.kml", content:Generate_KML()}];
  GmailApp.sendEmail(Session.getEffectiveUser(), "Google Contacts Map", 
                     "You can either open this KML file inside Google Earth or Google Maps", {attachments: attach});    
}

function Generate_KML() {
  var contacts = ContactsApp.getContacts();
  var kml  = '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">';
  kml += '<Document><name>Google Contacts</name><atom:author><atom:name>Digital Inspiration</atom:name>';
  kml += '</atom:author><atom:link href="http://www.labnol.org" />';
  
  for (var i=0; i<contacts.length; i++) {
    var name = contacts[i].getFullName();    
    var addr = contacts[i].getAddresses();
    if (!addr.length)
      addr = contacts[i].getAddresses(ContactsApp.Field.HOME_ADDRESS);
    if (!addr.length) 
      addr = contacts[i].getAddresses(ContactsApp.Field.WORK_ADDRESS);

    if (addr.length) {
      addr = addr[0].getAddress();
      addr = addr.replace(/\n/g, ", ");   
      // Get the Latitude, Longitude for the address
      var geocode = Maps.newGeocoder().geocode(addr);
      if (geocode.status == "OK") {
        var cordinates = geocode.results[0].geometry.location;      
        addr = geocode.results[0].formatted_address;
        kml += "<Placemark><name>" + name + "</name><description><![CDATA[";
        kml += addr + "]]></description><Point><coordinates>";
        kml += cordinates.lng + "," + cordinates.lat + "</coordinates>";
        kml += "</Point></Placemark>";      
      }            
    }
  }
  
  kml += '</Document></kml>';
  return kml;
}
