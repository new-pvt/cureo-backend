import { Doctor } from "../Models/AddDoctors.js";
import { error, success } from "../Utils/responseWrapper.js";




const Searchdoctorbyuser = async (req, res) => {
    const { lat, long } = req.params;
    if (!lat || !long) {
        return res.send(error(409, "no latitude or longitude"))
    }
    const mapdata = await getmapresults(lat, long);
    const location = mapdata?.results[0]?.address_components[1]?.long_name ?
        mapdata.results[0].address_components[1].long_name : ""
        ;
    // const location1 = mapdata?.results[0]?.address_components[2]?.long_name ? mapdata.results[0].address_components[2].long_name : "";
    // const location2 = mapdata?.results[0]?.address_components[3]?.long_name ? mapdata.results[0].address_components[3].long_name : "";
    // const location3 = mapdata?.results[0]?.address_components[4]?.long_name ? mapdata.results[0].address_components[4].long_name : "";
    // const location4 = mapdata.results[0].address_components[5].long_name ? mapdata.results[0].address_components[5].long_name : "";
    // const location5 = mapdata.results[0].address_components[6].long_name ? mapdata.results[0].address_components[6].long_name : "";
    // const location6 = mapdata.results[0].address_components[7].long_name ? mapdata.results[0].address_components[7].long_name : "";
    // const location7 = mapdata.results[0].address_components[8].long_name ? mapdata.results[0].address_components[8].long_name : "";
    const data = await Doctor.find({
        $or: [
            {
                location: {
                    $regex: location,
                    $options: "i",
                },
            },
            {
                mapLink: {
                    $regex: location,
                    $options: "i",
                }
            },
        ]
    }).limit(20)

    if (data.length > 0) {
        return res.send(success(200, { data, length: data.length }));
    }
    else {
        return res.send(success(200, { data: " no doctor available at your location" }))
    }
}



const Searchdoctorbylocation = async (req, res) => {
    const { speciality } = req.body;
    if (speciality) {
        // console.log("speciality byaddli request", req.body)
    }
    const location = req.body?.location?.terms[0]?.value ? req.body?.location?.terms[0]?.value : "";
    const location1 = req.body?.location?.terms[1]?.value ? req.body?.location?.terms[1]?.value : "";
    const location2 = req.body?.location?.terms[2]?.value ? req.body?.location?.terms[2]?.value : "";
    const location3 = req.body?.location?.terms[3]?.value ? req.body?.location?.terms[3]?.value : "";
    const location4 = req.body?.location?.terms[4]?.value ? req.body?.location?.terms[4]?.value : "";

    // console.log("req aayiiiiiiiiiiiiiii", req.body.location);
    try {
        const data = await Doctor.find({
            $or: [
                {
                    location: {
                        $regex: location,
                        $options: "i",
                    },
                },
                {
                    mapLink: {
                        $regex: location,
                        $options: "i",
                    }
                },
            ]
        })
        const data1 = await Doctor.find({
            $or: [
                {
                    location: {
                        $regex: location1,
                        $options: "i",
                    },
                },
                {
                    mapLink: {
                        $regex: location1,
                        $options: "i",
                    }
                },
            ]
        })
        const data2 = await Doctor.find({
            $or: [
                {
                    location: {
                        $regex: location2,
                        $options: "i",
                    },
                },
                {
                    mapLink: {
                        $regex: location2,
                        $options: "i",
                    }
                },
            ]
        })
        const data3 = await Doctor.find({
            $or: [
                {
                    location: {
                        $regex: location3,
                        $options: "i",
                    },
                },
                {
                    mapLink: {
                        $regex: location3,
                        $options: "i",
                    }
                },
            ]
        })
        const data4 = await Doctor.find({
            $or: [
                {
                    location: {
                        $regex: location4,
                        $options: "i",
                    },
                },
                {
                    mapLink: {
                        $regex: location4,
                        $options: "i",
                    }
                },
            ]
        })
        if (data.length > 0) {

            const filterdata = data.filter((item) => item.speciality == speciality)
            if (filterdata.length > 0) {
              
                return res.send(success(200, { data: filterdata }));


            }


            // const specilityName = data?.map((location) => location.speciality);
            // if (speciality) {
            //     const a = [...new Set(specilityName)]
            //     console.log(a)
            //     return;
            // }
            // const uniquespecilityName = [...new Set(data.speciality)];
            return res.send(success(200, { data: data }));
        }
        if (data1.length > 0) {



            const filterdata = data1.filter((item) => item.speciality == speciality)
            if (filterdata.length > 0) {
            
                return res.send(success(200, { data: filterdata }));


            }

            // const specilityName = data1?.map((location) => location.speciality);
            // if (speciality) {
            //     const a = [...new Set(specilityName)]
            //     console.log(a)
            //     return;
            // }
            return res.send(success(200, { data: data1 }));
        }
        if (data2.length > 0) {


            const filterdata = data2.filter((item) => item.speciality == speciality)
            if (filterdata.length > 0) {
           
                return res.send(success(200, { data: filterdata }));


            }

            // const specilityName = data2?.map((location) => location.speciality);
            // if (speciality) {
            //     const a = [...new Set(specilityName)]
            //     console.log(a)
            //     return;
            // }
            return res.send(success(200, { data: data2 }));
        }
        if (data3.length > 0) {


            const filterdata = data3.filter((item) => item.speciality == speciality)
            if (filterdata.length > 0) {
           
                return res.send(success(200, { data: filterdata }));

            }

            // const specilityName = data3?.map((location) => location.speciality);
            // if (speciality) {
            //     const a = [...new Set(specilityName)]
            //     console.log(a)
            //     return;
            // }
            return res.send(success(200, { data: data3 }));
        }
        if (data4.length > 0) {

            const filterdata = data4.filter((item) => item.speciality == speciality)
            if (filterdata.length > 0) {
              
                return res.send(success(200, { data: filterdata }));

            }

            // const specilityName = data4?.map((location) => location.speciality);
            // if (speciality) {
            //     const a = [...new Set(specilityName)]
            //     console.log(a)
            //     return;
            // }
            return res.send(success(200, { data: data4 }));
        }
        else {
            const filterdata = data4.filter((item) => item.speciality == speciality)
            if (filterdata.length > 0) {
          
                res.send(success(200, { data: data4 }));

            }

            // const specilityName = data4?.map((location) => location.speciality);
            // if (speciality) {
            //     const a = [...new Set(specilityName)]
            //     console.log(a)
            //     return;
            // }
            return res.send(success(200, { data: data4 }));
        }

    } catch (e) {
        return res.send(error(500, e.message));
    }

}


const getmapresults = async (latitude, longitude) => {
    if (latitude && longitude) {
        const result = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAqwfQ8_72yf13zLwiFI5c9ftGG1xNXC_0`
        );
        const data = await result.json();
        return data;
    } else {
        alert("Please provide latitude and longitude");
    }
};







export { Searchdoctorbyuser, Searchdoctorbylocation }

