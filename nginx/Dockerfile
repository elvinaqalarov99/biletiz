FROM nginx:alpine

# Copy the custom nginx.conf into the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports for Nginx (HTTP and HTTPS)
EXPOSE 80

# Run Nginx (the default command)
CMD ["nginx", "-g", "daemon off;"]