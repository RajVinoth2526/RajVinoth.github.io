function toCamelCaseProduct(row) {
  if (!row) return null;
  return {
    productId: row.product_id,
    title: row.title,
    sku: row.sku,
    label: row.label,
    stockQuantity: row.stock_quantity,
    price: Number(row.price),
    compareAtPrice: Number(row.compare_at_price),
    discountPercentage: Number(row.discount_percentage),
    colors: row.colors,
    colorsArray: row.colors_array,
    size: row.size,
    material: row.material,
    weight: Number(row.weight),
    dimensions: row.dimensions,
    description: row.description,
    specification: row.specification,
    careInstructions: row.care_instructions,
    category: row.category,
    subCategory: row.sub_category,
    type: row.type,
    tags: row.tags,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    isActive: row.is_active,
    isFeatured: row.is_featured,
    imageUrl: row.image_url,
    defaultImageIndex: row.default_image_index,
    subTitle: row.sub_title,
    contant: row.contant,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    _cursor: row.created_at
  };
}

function toCamelCaseCategory(row) {
  return {
    productId: row.product_id,
    title: row.title,
    category: row.category,
    imageUrl: row.image_url,
    createdAt: row.created_at
  };
}

function toCamelCaseSlider(row) {
  return {
    productId: row.product_id,
    title: row.title,
    subTitle: row.sub_title,
    specification: row.specification,
    colors: row.colors,
    category: row.category,
    contant: row.contant,
    imageUrl: row.image_url,
    createdAt: row.created_at
  };
}

function toCamelCaseProfile(row) {
  return {
    uid: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    address1: row.address1,
    address2: row.address2,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    birthday: row.birthday,
    isAdmin: row.is_admin
  };
}

function toCamelCaseCartItem(row) {
  return {
    id: row.product_id,
    image: row.image,
    name: row.name,
    price: Number(row.price),
    size: row.size,
    quantity: row.quantity,
    label: row.label,
    color: row.color,
    category: row.category,
    description: row.description,
    userId: row.user_id,
    createdAt: row.created_at
  };
}

function toCamelCaseOrder(row) {
  return {
    orderId: row.order_id,
    userId: row.user_id,
    cardItems: row.card_items,
    card: row.card_items,
    customerDetails: row.customer_details,
    paymentMethod: row.payment_method,
    createdAt: row.created_at
  };
}

module.exports = {
  toCamelCaseProduct,
  toCamelCaseCategory,
  toCamelCaseSlider,
  toCamelCaseProfile,
  toCamelCaseCartItem,
  toCamelCaseOrder
};
