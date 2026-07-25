import { supabase } from '../supabaseClient';
import { propertiesData } from './propertiesData';

// Self-cleaning check for stale cache (old investment style)
try {
  const localData = localStorage.getItem('bhri_properties');
  if (localData) {
    const parsed = JSON.parse(localData);
    if (Array.isArray(parsed) && parsed.some(p => p.investment && p.investment.style === 'list-mv')) {
      localStorage.removeItem('bhri_properties');
    }
  }
} catch (e) {}

// Map database column names (snake_case) to client properties (camelCase)
const mapDbToProperty = (dbRow) => {
  if (!dbRow) return null;
  return {
    id: dbRow.id,
    title: dbRow.title,
    subtitle: dbRow.subtitle,
    heroImage: dbRow.hero_image,
    location: dbRow.location,
    locationFull: dbRow.location_full,
    badgeLocation: dbRow.badge_location,
    badgeStatus: dbRow.badge_status,
    type: dbRow.type,
    typeFull: dbRow.type_full,
    cardImage: dbRow.card_image,
    description: dbRow.description,
    iconName: dbRow.icon_name,
    highlightText: dbRow.highlight_text,
    intro: dbRow.intro,
    facilities: dbRow.facilities,
    developments: dbRow.developments,
    investment: dbRow.investment
  };
};

const mapPropertyToDb = (property) => {
  if (!property) return null;
  return {
    id: property.id,
    title: property.title,
    subtitle: property.subtitle,
    hero_image: property.heroImage,
    location: property.location,
    location_full: property.locationFull,
    badge_location: property.badgeLocation,
    badge_status: property.badgeStatus,
    type: property.type,
    type_full: property.typeFull,
    card_image: property.cardImage,
    description: property.description,
    icon_name: property.iconName,
    highlight_text: property.highlightText,
    intro: property.intro,
    facilities: property.facilities,
    developments: property.developments,
    investment: property.investment,
    updated_at: new Date().toISOString()
  };
};

export const getAllProperties = async () => {
  try {
    const localData = localStorage.getItem('bhri_properties');
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error("Failed to fetch properties from Supabase, falling back to local data:", error);
      if (localData) {
        try { return JSON.parse(localData); } catch (e) {}
      }
      return propertiesData;
    }
    
    if (!data || data.length === 0) {
      console.log("No properties found in Supabase database.");
      if (localData) {
        try { return JSON.parse(localData); } catch (e) {}
      }
      return [];
    }
    
    const mapped = data.map(mapDbToProperty);
    localStorage.setItem('bhri_properties', JSON.stringify(mapped));
    return mapped;
  } catch (e) {
    console.error("Exception fetching properties:", e);
    const localData = localStorage.getItem('bhri_properties');
    if (localData) {
      try { return JSON.parse(localData); } catch (e) {}
    }
    return propertiesData;
  }
};

export const getPropertyById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error(`Failed to fetch property ${id} from Supabase, falling back to local data:`, error);
      const localData = localStorage.getItem('bhri_properties');
      if (localData) {
        try {
          const list = JSON.parse(localData);
          const item = list.find(p => p.id === id);
          if (item) return item;
        } catch (e) {}
      }
      return propertiesData.find(p => p.id === id) || null;
    }
    
    if (!data) return null;
    return mapDbToProperty(data);
  } catch (e) {
    console.error("Exception fetching property by id:", e);
    const localData = localStorage.getItem('bhri_properties');
    if (localData) {
      try {
        const list = JSON.parse(localData);
        const item = list.find(p => p.id === id);
        if (item) return item;
      } catch (err) {}
    }
    return propertiesData.find(p => p.id === id) || null;
  }
};

export const saveProperty = async (property) => {
  // Sync to localStorage
  try {
    const localData = localStorage.getItem('bhri_properties');
    let list = [];
    if (localData) {
      try { list = JSON.parse(localData); } catch (e) {}
    }
    if (!list || list.length === 0) {
      list = [...propertiesData];
    }
    const idx = list.findIndex(p => p.id === property.id);
    if (idx !== -1) {
      list[idx] = property;
    } else {
      list.push(property);
    }
    localStorage.setItem('bhri_properties', JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }

  // Save to Supabase
  const dbData = mapPropertyToDb(property);
  try {
    const { error } = await supabase
      .from('properties')
      .upsert(dbData);
      
    if (error) {
      console.error("Failed to save property in Supabase:", error);
      // If it is a fetch or placeholder-related error, do not block the editor (log it instead)
      if (error.message && (error.message.includes('fetch') || error.message.includes('placeholder') || error.message.includes('network'))) {
        console.warn("Offline fallback saved to localStorage successfully.");
        return;
      }
      throw error;
    }
  } catch (err) {
    console.error("Supabase upsert threw exception:", err);
    // Ignore fetch or network exceptions to allow offline mode saving
    if (err.message && (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('Failed to fetch'))) {
      console.warn("Offline fallback saved to localStorage successfully after network exception.");
      return;
    }
    throw err;
  }
};

export const deleteProperty = async (id) => {
  // Sync delete from localStorage
  try {
    const localData = localStorage.getItem('bhri_properties');
    if (localData) {
      try {
        let list = JSON.parse(localData);
        list = list.filter(p => p.id !== id);
        localStorage.setItem('bhri_properties', JSON.stringify(list));
      } catch (e) {}
    }
  } catch (e) {
    console.error("Failed to delete from localStorage:", e);
  }

  // Delete from Supabase
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Failed to delete property ${id} from Supabase:`, error);
      if (error.message && (error.message.includes('fetch') || error.message.includes('placeholder') || error.message.includes('network'))) {
        console.warn("Offline fallback deleted from localStorage successfully.");
        return;
      }
      throw error;
    }
  } catch (err) {
    console.error("Supabase delete threw exception:", err);
    if (err.message && (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('Failed to fetch'))) {
      console.warn("Offline fallback deleted from localStorage successfully after network exception.");
      return;
    }
    throw err;
  }
};

// Upload media file to Supabase storage bucket
export const uploadMedia = async (file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('properties-media')
      .upload(cleanFileName, file);
      
    if (error) {
      throw error;
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('properties-media')
      .getPublicUrl(cleanFileName);
      
    return publicUrlData.publicUrl;
  } catch (e) {
    console.error("Storage upload error:", e);
    throw e;
  }
};

// Create a template structure for a new property
export const createDefaultPropertyTemplate = (id, title, location) => {
  return {
    id: id,
    title: title || "New Leisure Community",
    subtitle: "A description of the newest leisure community, designed to provide luxurious living and nature's embrace.",
    heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYIzXNL0I0CC9R96cf-qKacfjTTxiy83hD_WAzdulDrG-4EUDHyKMHK02rlVw1EkzHoxN-Cdiu17cmlDypvf9OxGVSS06_cFjPWD6FVjFxKTIwlFrJdaqkmt3_nMiqWz4izKvPacItjxZSiFhicfHyM8K9wgYfH4pNgLY0Gdr4pASgEIOkcJyIvOnpD-3qzVUY9ItE6440PnQ-8YAgV6BZxJYtJdb798CBr5jNEopdNsO_4rnvZ8ByCx2BH-n4Z1uklCeSOQ_izFs",
    location: location || "Cavite",
    locationFull: `${location === 'Batangas' ? 'Nasugbu, Batangas' : 'Indang, Cavite'}`,
    badgeLocation: `${(location || "Cavite").toUpperCase()} PHILIPPINES`,
    badgeStatus: "PRE-SELLING",
    type: location === 'Batangas' ? 'resort' : 'farm',
    typeFull: location === 'Batangas' ? 'Resort Estate' : 'Leisure Farm Lot',
    cardImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJHgEBLDZpW51YnAo_ojFVQTDFd04zPCEbnHHaldmsXuTVdw26qXlTI5sy0nCsEXAjcTxiWIjEGUmgWM0AtfyuGFSZiTNGNyFFTWZBlwK_d_vj8x5fjHqIN2OKs8CVxyq-Jhrnbsn7K5Y018riiBZLGmN91RJBSSEg6dMrJeaz7vjdymareZbO1dmKc1aygYq2LhfdoA19nHg5uXI0w5kszq4g2y8RP8JNAfOJUHT0D2p5SPll0YG4UaVR5SSYPbfJ8yl0HNWXudI",
    description: "Discover a green escape offering standard modern resort-like farm living and sustainable spaces.",
    iconName: location === 'Batangas' ? 'landscape' : 'nature',
    highlightText: location === 'Batangas' ? 'Residential and Commercial' : 'Residential Farm Lots',
    intro: {
      tag: "Premier Leisure Estate",
      title: "Where Harmony Meets Modern Living",
      text: [
        "This leisure community provides standard proximity to surrounding vacation destinations and cool natural breezes.",
        "Sustainable and luxurious living is built in, offering farm lots nestled within scenic pastures.",
        "Experience unique amenities designed to promote organic agricultural opportunities and holistic wellness."
      ],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsBUK6FRfbIt94FkWTZ--rFCcfNlJIbBYRS5aI33ftiQrCMKRR6SE8xmppEGxbI1iM4aY0ThYpIDxmCyO3Twwg92jYidjJAkBicIFe3ubY7njyscqwyAlVThPn2vwMkpHqCpA1z7iL5EjKoaCmCHuMNpVYW9zSqGokRUVKBZZcWh0JVaLZEE2qYMGZm7V7ffUr4ARiRU4TkbT8MdbXiXBSBJMGlpEd9R3ncaQ6pgNEBAAQ1lfAQtUy0gs38iV6-i4Ytx0VtG7j24",
      stats: [
        { value: "10 Hectares", label: "Lush Estate" },
        { value: "Organic", label: "Farm-to-Table Focus" }
      ]
    },
    facilities: {
      title: "World-Class Leisure Facilities",
      subtitle: "We strive to bring the comfort and luxury of modern amenities to rural settings, enhancing your quality of life.",
      style: "bento-ewb",
      items: [
        {
          id: "clubhouse",
          title: "Modern Clubhouse",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjIv9rUWwuBCdm1j_9MO32S3LcSoEixAsCBeKcPVf2cQvly3KZrdfjhCGkdkplnK025HwbHfE6h7X5meUotlDU7KndHNF-OmsRCm8LEI_oM4D3cid0x652qsPxSI_KgRVZwLCCYhn6zNywMoDBJq49bPnYGsXPQL1LW8hRJ5i7J2de9DStJBnsFFKxd_mq4s3hTHz4mDBiS1vFiharXHjUCQdA4L-kw_cV7ORUqJMzjbqBxvz6szz8iEITEJ3IVEEXXIRyFA9H8xk"
        },
        {
          id: "pools",
          title: "Swimming Pools",
          image: "https://lh3.googleusercontent.com/aida/AP1WRLuT_DVBPXfG5XHC6a5-6qUKT0gGcpLXRLutI7IWf3-jxojcO9RkdHCp_j9JRwJGMemWddqPsVa2dhwHI5FNncltUWrX4t9t8psmPgBbJIPlIy1lpwIVI-bCvbjUD147hALS4jZOi4AdZV2NHoR-Ig-KAD0p2eXp7bCns4iIsxAo7lGQwtcKbw3cTx5TXZ0xm7Z8TCMD4_E-DT6g-Aft6EQctHbJrSSWQNNDd5ky5yxhOnetPcwZ7z4wpsQ"
        },
        {
          id: "farms",
          title: "Organic Farms",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4YFIg_2hAlgPyCoAQGDlZW4JJo9M6y8Q-2VEcfZM-5yxidUsrEw7zcaUSmd1RaciW5PXyllL5DDnf8VxjYgesDIycTOKnyBFShziLcgTASXXKBqvdVvP3JVBvlLOw-F3PNu9BDm-PIJjK_XN9LT-mUDA4XUxWP9_Zz4RdQwZEaGVelYG5OxXKDfhaSwhsFPQlJ9YkzepjwWySI2TBUqgM-wRE8Qjr09xvHsMErvCMYGUi6qgogZdotvehB8ss6XeRvOrwRt1fXOY"
        },
        {
          id: "wellness",
          title: "Wellness Spaces",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBV9vI9Lcb8HcUtKINxr0pNPyagLYFTpcfCm_5WRl0VY6oquT1A47aWq-tq0aHeuOnXskYDCu73v1UP1scL3xB0gYSO8NgmZdy_VT1oJ0Yc9QafMvalSdcOA5pizAUloyO06zqdonMEzf9Pp-hk4UdH8exawtjrMNm9BJLBkLc8jW9gRB2KrQnLTDzeS3NlK4RWCZuMJcSwPvuHw77A_viSR9ad8w52FKmDFLd5hez_q4JGqBm8zevTIJ5rCglJxOlnUwUFym8zBI"
        },
        {
          id: "parks",
          title: "Lush Parks",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlMORU-0xZb2INO2g9_Nfbqvidjpi-HWfGD-nkVdY5ManGU4CDtJR3LNfNyybYabx_pMhE2oWC9v_wmxGE6WyEqCk6CR_HJ0_vQEjPSDj4ZPTIkvTzanqCZn1LV1LQ4xaV2MjgCTEYXdTEdJ9OwR-6ZJDfFQklQeEoB6bwlmHycPXe0T6YEZtZ8Qe64gac90gIPVR3b41LZfx4Q_6KqiVtEpAi_wJoOwyRf5bUQF7n39XiB3jaNthb4aIVSx87pOthmFbGuaLp0Lw"
        }
      ]
    },
    developments: {
      title: "Project Developments",
      subtitle: "Witness the construction progress of our premier sustainable haven.",
      style: "bento-ewb",
      items: [
        {
          id: "gatehouse",
          title: "Main Gatehouse Construction",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxk7O-y3X-hdQRWoAVAKEj1_MqJ907Hk8Kz-aWRnANDq4AWq-8msOjy_wNiQdEzhd3T3q-IskGCDA8ZuiNQSy4u7k2-OUwMf_1RBvYz1Kxxvac8gV41_4PRX4omxS6Cw3mYaexUWw1-lGJxGN6VPE0qYM4IlS9RMShG_8YPQk3b4eQTucKDO4OnQq7z47Sm4S9uUzLHYEoVhQPucUef4SSddsS0n3Bg1OIJByf4ew4ZnFU0QQ9ZQLdgZ1fzuK8Mn6d-O5g-YjTtPg"
        },
        {
          id: "landscaping",
          title: "Community Entrance Landscaping",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwzjFUoDdF4UAedFYCe5TRZ6_IuujTpSEjXVdrShktKJ5QLcjpUAtetsoUIgwU8tQKOLXT6euApZrVSxdUr6BieYz8rJqt9Ghh1gEvDavBLHtyQ_AICyv-JsDT9f3rDplKJVdAgsST5wMfY6bkARCJU53GElQn1jv1oKPjvY3ibXTIGQImygYQpKKQDA6LIK8cdx49_Wxx0VBzmfxNLgfrGdLs06PHLBH3_jVBU1FfbTzPFN-upU4rjNoz3TIrdS0zQ9n6q_R6CvY"
        },
        {
          id: "infrastructure",
          title: "Sustainable Water Features",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaEA3K91iW7qlYWskAWlOGm8K0mc9ZQaVbMO7cIXxyVavqcbrfbOYafSknwrioK9fyOf0czv1htuJ5z4d4ZuAX6T2fMs-QD_tjMnRxU3h7XkzlxfwF_aj_YUbuamHDFPybe-hS3nrBllLiKK-f473tNciCDt4AtEgd40UHunnrWAz29TVa9Kps-JxxGL2jF3yRi_ErmSrjnjofMlSa4v9jGn4ZAuY31LlZ8vBFHQ90I7Fx189YbI5vRlkF4RMyp1Cm6dZ1CZSDeBM"
        }
      ]
    },
    investment: {
      title: "The Smart Choice for Future Generations",
      style: "bento-ewb-inv",
      items: [
        {
          type: "large",
          title: "Capital Appreciation",
          description: "Leisure farm lots in developing regions represent a secure opportunity. Increasing demands for green escapes ensure appreciation of assets.",
          icon: "trending_up",
          bgClass: "bg-primary text-on-primary",
          bgDecoration: "finance_chip"
        },
        {
          type: "small-text",
          title: "Personal Fulfillment",
          description: "Enjoy harvesting organic crops and creating a family sanctuary away from city stress.",
          bgClass: "bg-tertiary text-on-tertiary"
        },
        {
          type: "small-icon",
          title: "Secure Legacy",
          description: "An asset to hand down to children, providing wellness and recreation.",
          icon: "shield_lock",
          bgClass: "bg-surface-container-high text-primary"
        },
        {
          type: "medium-text",
          title: "Expanding Tourism Hub",
          description: "Proximity to vacation centers makes it prime for weekend visits and eco-tourism projects.",
          icon: "home_work",
          bgClass: "bg-secondary-container text-on-secondary-container"
        }
      ]
    }
  };
};
